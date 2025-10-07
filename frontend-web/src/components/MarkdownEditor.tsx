import React, { useMemo } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = 'Write your note content here...' 
}) => {
  const options = useMemo(() => {
    return {
      spellChecker: false,
      placeholder,
      status: false,
      toolbar: [
        'bold',
        'italic',
        'heading',
        '|',
        'quote',
        'unordered-list',
        'ordered-list',
        '|',
        'link',
        'image',
        '|',
        'code',
        'table',
        '|',
        'preview',
        'side-by-side',
        'fullscreen',
        '|',
        'guide',
      ],
      minHeight: '400px',
      maxHeight: '600px',
    };
  }, [placeholder]);

  return (
    <div className="markdown-editor">
      <SimpleMDE
        value={value}
        onChange={onChange}
        options={options}
      />
    </div>
  );
};

export default MarkdownEditor;
