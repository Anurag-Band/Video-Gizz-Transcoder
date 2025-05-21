import VideoPlayer from "./VideoPlayer";

const App = () => {
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          marginBottom: "30px",
          color: "#333",
          fontSize: "32px",
        }}
      >
        Video Player
      </h1>
      <VideoPlayer videoId="823365e7-2870-443c-9b53-e47e63a4d51c" />
    </div>
  );
};

export default App;
