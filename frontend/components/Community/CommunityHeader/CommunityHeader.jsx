import "../../../src/assets/moviebanner.jpg" ;

function CommunityHeader({ community }) {
  if (!community) return null;

  return (
    <div className="communityHeader">
      <div className="bannerContainer">
      <img 
        src="../../../src/assets/moviebanner.jpg" 
        alt="banner" 
        className="banner" 
      />
      </div>

      <div className="info">
       <img 
         src="../../../src/assets/movieicon.webp" 
          alt="icon" 
          className="communityIcon" 
        />

        <div className="textInfo">
          <h1 className="name">r/{community.name}</h1>
          <p className="description">Movie Details, Movie Details</p>
        </div>

        <div className="buttonGroup">
          <button className="createPostBtn">+ Create Post</button>
          <button className="joinBtn">Join</button>
        </div>
      </div>
    </div>
  );
}

export default CommunityHeader;