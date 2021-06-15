import { EditorState } from "draft-js";
import Editor from "@draft-js-plugins/editor";

import createMentionPlugin, {
  defaultSuggestionsFilter,
} from "@draft-js-plugins/mention";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import mentions from "../../data/users";
import "@draft-js-plugins/mention/lib/plugin.css";

// const mentionPlugin = createMentionPlugin();
// const { MentionSuggestions } = mentionPlugin;
// const plugins = [mentionPlugin];

const MentionDraft = () => {
  const ref = useRef<Editor>(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(mentions);

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin();
    // eslint-disable-next-line no-shadow
    const { MentionSuggestions } = mentionPlugin;
    // eslint-disable-next-line no-shadow
    const plugins = [mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);

  // const handleChange = (editorState: EditorState) => {

  //   setEditorState(editorState);
  // };

  // const onOpenChange = (_open: boolean) => {
  //   setOpen(_open);
  // };

  // const onSearchChange = ({ trigger, value }) => {
  //   setSuggestions(defaultSuggestionsFilter(value, mentions));
  // };

  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open);
  }, []);
  const onSearchChange = useCallback(({ value }: { value: string }) => {
    setSuggestions(defaultSuggestionsFilter(value, mentions));
  }, []);

  return (
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
        editorKey={"editor"}
      />
      <MentionSuggestions
        onSearchChange={onSearchChange}
        onOpenChange={onOpenChange}
        suggestions={suggestions}
        open={open}
      />
    </div>
  );
};

export default MentionDraft;
