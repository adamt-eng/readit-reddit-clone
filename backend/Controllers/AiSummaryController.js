import mongoose from "mongoose";
import AiSummary from "../Models/Ai_Summary.js";
import Post from "../Models/Post.js";
import { InferenceClient } from "@huggingface/inference";

const { Types } = mongoose;

const DEFAULT_HF_MODEL = "sshleifer/distilbart-cnn-12-6";

const hfToken = process.env.HF_TOKEN;
if (!hfToken) throw new Error("HF_TOKEN is required");

const hfClient = new InferenceClient(hfToken);

async function callHfSummarize(input, model = DEFAULT_HF_MODEL) {
  const output = await hfClient.summarization({
    model,
    inputs: input,
    parameters: {
      max_length: 200,
      min_length: 60,
    },
  });

  const item = Array.isArray(output) ? output[0] : output;

  return {
    summary: (item.summary_text || "").trim(),
    modelName: model,
  };
}

async function summarizePost(post, { hfModel }) {
  const title = post.title || "Untitled";
  const content = (post.text || "").slice(0, 4000);
  const input = `${title}\n\n${content}`;

  const hf = await callHfSummarize(input, hfModel);

  return {
    summaryText: hf.summary,
    modelMeta: {
      modelName: hf.modelName,
      provider: "hf-inference",
      tokensUsed: undefined,
    },
  };
}

export const getOrGenerateSummaryForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const hfModel =
      req.query?.hfModel || req.body?.hfModel || DEFAULT_HF_MODEL;

    if (!Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid or missing postId" });
    }

    const existing = await AiSummary.findOne({ postId })
      .populate("generatedBy", "username avatarUrl")
      .select("-__v");

    if (existing) return res.json(existing);

    const post = await Post.findById(postId).select("title text authorId");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const { summaryText, modelMeta } = await summarizePost(post, { hfModel });

    const created = await AiSummary.create({
      postId,
      summaryText,
      generatedBy: post.authorId,
      modelMeta,
      createdAt: new Date(),
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error("AI SUMMARY ERROR:", err);
    return res
      .status(500)
      .json({ message: "Failed to get or generate AI summary" });
  }
};

export const generateSummaryForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const hfModel = req.body?.hfModel || DEFAULT_HF_MODEL;

    if (!Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid or missing postId" });
    }

    const post = await Post.findById(postId).select("title text authorId");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existing = await AiSummary.findOne({ postId });

    const { summaryText, modelMeta } = await summarizePost(post, { hfModel });

    if (existing) {
      existing.summaryText = summaryText;
      existing.generatedBy = post.authorId;
      existing.modelMeta = modelMeta;
      existing.createdAt = new Date();
      await existing.save();
      return res.json(existing);
    }

    const created = await AiSummary.create({
      postId,
      summaryText,
      generatedBy: post.authorId,
      modelMeta,
      createdAt: new Date(),
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error("AI SUMMARY GENERATE ERROR:", err);
    return res.status(500).json({ message: "Failed to generate AI summary" });
  }
};

export default {
  getOrGenerateSummaryForPost,
  generateSummaryForPost,
};