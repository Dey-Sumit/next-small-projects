import React, {
  ReactElement,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import Editor from "@draft-js-plugins/editor";
import createMentionPlugin, {
  defaultSuggestionsFilter,
  MentionData,
} from "@draft-js-plugins/mention";
import mentions from "../../data/users";
import "@draft-js-plugins/mention/lib/plugin.css";

const SimpleMentionEditor = (): ReactElement => {
  const ref = useRef<Editor>(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<MentionData[]>(mentions);
  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin();
    // eslint-disable-next-line no-shadow
    const { MentionSuggestions } = mentionPlugin;
    // eslint-disable-next-line no-shadow
    const plugins = [mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);

  const onChange = useCallback((_editorState: EditorState) => {
    setEditorState(_editorState);
  }, []);

  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open);
  }, []);

  const onSearchChange = useCallback(({ value }: { value: string }) => {
    setSuggestions(defaultSuggestionsFilter(value, mentions));
  }, []);

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
    blocks.map((block) => console.log(block));

    console.log({ value });
  };

  return (
    <div>
      <div
        className="editor"
        onClick={() => {
          ref.current!.focus();
        }}
      >
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          plugins={plugins}
          ref={ref}
          editorKey="editor"
        />
        <MentionSuggestions
          open={open}
          onOpenChange={onOpenChange}
          onSearchChange={onSearchChange}
          suggestions={suggestions}
          onAddMention={() => {
            // get the mention object selected
          }}
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
          onClick={handleExtractMentions}
          className="p-2 bg-gray-600 rounded-md"
        >
          Extract Mentions
        </button>
        <button className="p-2 bg-gray-600 rounded-md" onClick={() => {}}>
          Extract Hashtags
        </button>
      </div>
    </div>
  );
};

export default SimpleMentionEditor;
