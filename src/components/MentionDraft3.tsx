import React, { ReactElement, useRef, useState, useCallback } from "react";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import Editor from "@draft-js-plugins/editor";
import createMentionPlugin, {
  defaultSuggestionsFilter,
  MentionData,
} from "@draft-js-plugins/mention";
import "@draft-js-plugins/mention/lib/plugin.css";

import mentions from "../../data/data";

const mentionPlugin = createMentionPlugin({ mentionTrigger: ["@", "("] });
const { MentionSuggestions } = mentionPlugin;
const plugins = [mentionPlugin];

const SimpleMentionEditor = (): ReactElement => {
  const ref = useRef<Editor>(null);
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText("hi"))
  );

  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(mentions["@"]);

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
  const handleExtractMentions = () => {
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    const entityMap = raw.entityMap;
    Object.values(entityMap).map((entity) => {
      console.log(entity.data.mention);
    });
  };
  const handleExtractData = (params) => {
    const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
    const value = blocks
      .map((block) => (!block.text.trim() && "\n") || block.text)
      .join("\n");
    console.log({ value });
  };

  return (
    <>
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
          placeholder="Hey! What's up?"
        />
        <MentionSuggestions
          open={open}
          onOpenChange={onOpenChange}
          onSearchChange={onSearchChange}
          suggestions={suggestions}
          onAddMention={onAddMention}
        />
      </div>
      <div className="flex space-x-5 text-white">
        <button
          className="p-2 bg-gray-600 rounded-md"
          onClick={handleExtractData}
        >
          Extract Data
        </button>
        <button
          className="p-2 bg-gray-600 rounded-md"
          onClick={handleExtractMentions}
        >
          Extract Mentions
        </button>
        <button className="p-2 bg-gray-600 rounded-md" onClick={() => {}}>
          Extract Hashtags
        </button>
      </div>
    </>
  );
};

export default SimpleMentionEditor;
