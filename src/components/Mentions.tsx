import { useState } from "react";
import { MentionsInput, Mention } from "react-mentions";
const users = [
  {
    id: "1",
    display: "Jimmy",
  },
  {
    id: "2",
    display: "Ketut",
  },
  {
    id: "3",
    display: "Gede",
  },
];
const Mentions = () => {
  const [comment, setComment] = useState("");
  const [data, setData] = useState(null);
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  const handleSubmitComment = () => {
    if (!comment) return;
    setData(comment);
  };
  return (
    <div className="flex flex-col p-10 space-y-3 font-serif text-xl text-white">
      <MentionsInput
        className="h-24 text-blue-600 border w-72"
        value={comment}
        onChange={handleCommentChange}
      >
        <Mention
          trigger="@"
          data={users}
          appendSpaceOnAdd
          renderSuggestion={(
            suggestion,
            search,
            highlightedDisplay,
            index,
            focused
          ) => (
            <div className={` ${focused ? "text-red" : ""}`}>
              {JSON.stringify(highlightedDisplay) + "1"}
            </div>
          )}
          style={{ backgroundColor: "white" }}
        />
        <Mention
          trigger="#"
          data={users}
          appendSpaceOnAdd
          style={{ backgroundColor: "red" }}
        />
      </MentionsInput>

      <button
        onClick={handleSubmitComment}
        className="w-32 p-1 text-lg bg-gray-700 border"
      >
        Comment
      </button>
      <span className="">Data : {data}</span>
    </div>
  );
};

export default Mentions;
