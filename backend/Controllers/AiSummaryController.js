import mongoose from "mongoose";
import AiSummary from "../Models/Ai_Summary.js";
import Post from "../Models/Post.js";
import { InferenceClient } from "@huggingface/inference";

const { Types } = mongoose;

const DEFAULT_HF_MODEL = "facebook/bart-large-cnn";

const hfToken = process.env.HF_TOKEN ?? "You no have token!!!";
if (!hfToken) throw new Error("HF_TOKEN is required");

const hfClient = new InferenceClient(hfToken);

async function callHfSummarize(input) {
  const output = await hfClient.summarization({
    model: DEFAULT_HF_MODEL,
    inputs: input,
    parameters: {
      max_length: 200,
      min_length: 60,
    },
  });

  return {
    summary: (output.summary_text || "summary_text not available").trim(),
    modelName: DEFAULT_HF_MODEL,
  };
}

async function summarizePost(post) {
  const title = post.title || "Untitled";
  const content = (post.content || "").slice(0, 4000);
  const input = `${title} ${content}`;

  const hf = await callHfSummarize(input);

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

    if (!Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid or missing postId" });
    }

    const existing = await AiSummary.findOne({ postId })
      .populate("generatedBy", "username avatarUrl")
      .select("-__v");

    if (existing) return res.json(existing);

    const post = await Post.findById(postId).select("title content authorId");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const { summaryText, modelMeta } = await summarizePost(post);

    const created = await AiSummary.create({
      postId,
      summaryText,
      generatedBy: post.authorId,
      modelMeta,
      createdAt: new Date(),
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error("AI Summary Error:", err);
    return res
      .status(500)
      .json({ message: "Failed to get or generate AI summary" });
  }
};

export const generateSummaryForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid or missing postId" });
    }

    const post = await Post.findById(postId).select("title content authorId");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existing = await AiSummary.findOne({ postId });

    const { summaryText, modelMeta } = await summarizePost(post);

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
    console.error("AI Summary Generate Error:", err);
    return res.status(500).json({ message: "Failed to generate AI summary" });
  }
};

export default {
  getOrGenerateSummaryForPost,
  generateSummaryForPost,
};