import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 text-gray-900" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-3 text-gray-900" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-2 text-gray-900" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-lg font-bold mb-2 text-gray-900" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700" {...props} />,
          li: ({ node, ...props }) => <li className="ml-4" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary-500 pl-4 py-2 mb-4 italic text-gray-600 bg-gray-50" {...props} />
          ),
          code: ({ node, inline, ...props }: any) =>
            inline ? (
              <code className="bg-gray-100 text-primary-600 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
            ) : (
              <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto font-mono text-sm" {...props} />
            ),
          pre: ({ node, ...props }) => <pre className="mb-4" {...props} />,
          a: ({ node, ...props }) => (
            <a className="text-primary-600 hover:text-primary-700 underline" target="_blank" rel="noopener noreferrer" {...props} />
          ),
          img: ({ node, ...props }) => (
            <img className="max-w-full h-auto rounded-lg mb-4" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-gray-50" {...props} />,
          tbody: ({ node, ...props }) => <tbody className="bg-white divide-y divide-gray-200" {...props} />,
          tr: ({ node, ...props }) => <tr {...props} />,
          th: ({ node, ...props }) => (
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
          ),
          td: ({ node, ...props }) => <td className="px-4 py-2 text-sm text-gray-900" {...props} />,
          hr: ({ node, ...props }) => <hr className="my-6 border-t border-gray-300" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
          em: ({ node, ...props }) => <em className="italic" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
