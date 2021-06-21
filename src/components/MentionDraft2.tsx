import React, { ReactElement, useRef, useState, useCallback } from "react";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import Editor from "@draft-js-plugins/editor";
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from "@draft-js-plugins/mention";
import mentions from "../../data/data";
import "@draft-js-plugins/mention/lib/plugin.css";
const mentionPlugin = createMentionPlugin({
  //   mentionPrefix: "@",
  mentionTrigger: "@",
  entityMutability: "IMMUTABLE",
});

const hashtagMentionPlugin = createMentionPlugin({
  mentionPrefix: "#",
  mentionTrigger: "#",
  entityMutability: "IMMUTABLE",
});
const plugins = [mentionPlugin, hashtagMentionPlugin];
const { MentionSuggestions } = mentionPlugin;
const { MentionSuggestions: HashtagMentionSuggestions } = hashtagMentionPlugin;

const MentionDraft2 = () => {
  const ref = useRef<Editor>(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(mentions["#"]);

  const onChange = (value): void => {
    setEditorState(value);
  };

  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open);
  }, []);
  const onSearchChange = useCallback(
    ({ trigger, value }: { trigger: string; value: string }) => {
      //@ts-ignore
      setSuggestions(defaultSuggestionsFilter(value, mentions, trigger));
    },
    []
  );

  const onAddMention = (): void => {
    // get the mention object selected
  };
  const handleExtractData = () => {
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    console.log(raw);
  };

  return (
    <div className="mt-10">
      <div
        className="editor"
        onClick={() => {
          ref.current!.focus();
        }}
      >
        <Editor
          editorState={editorState}
          onChange={onChange}
          plugins={plugins}
          ref={ref}
          editorKey="editor"
        />
        <MentionSuggestions
          open={open}
          onOpenChange={onOpenChange}
          onSearchChange={onSearchChange}
          suggestions={suggestions}
          onAddMention={onAddMention}
        />
        {/* <HashtagMentionSuggestions
          open={open}
          onOpenChange={onOpenChange}
          onSearchChange={onSearchChange}
          suggestions={suggestions}
          onAddMention={onAddMention}
        /> */}
      </div>
      <div className="flex space-x-5 text-white">
        <button
          className="p-2 bg-gray-600 rounded-md"
          onClick={handleExtractData}
        >
          Extract Data
        </button>
        <button className="p-2 bg-gray-600 rounded-md" onClick={() => {}}>
          Extract Mentions
        </button>
        <button className="p-2 bg-gray-600 rounded-md" onClick={() => {}}>
          Extract Hashtags
        </button>
      </div>
    </div>
  );
};

export default MentionDraft2;
