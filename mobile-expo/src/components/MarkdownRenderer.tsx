import React from 'react';
import { View } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface MarkdownRendererProps {
  content: string;
  style?: any;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  style = {} 
}) => {
  const markdownStyles = {
    body: {
      color: '#374151',
      fontSize: 16,
      lineHeight: 24,
    },
    heading1: {
      color: '#111827',
      fontSize: 28,
      fontWeight: 'bold',
      marginTop: 24,
      marginBottom: 16,
    },
    heading2: {
      color: '#111827',
      fontSize: 24,
      fontWeight: '600',
      marginTop: 20,
      marginBottom: 12,
    },
    heading3: {
      color: '#111827',
      fontSize: 20,
      fontWeight: '600',
      marginTop: 16,
      marginBottom: 8,
    },
    paragraph: {
      marginTop: 8,
      marginBottom: 8,
    },
    strong: {
      fontWeight: 'bold',
      color: '#111827',
    },
    em: {
      fontStyle: 'italic',
      color: '#4B5563',
    },
    code_inline: {
      backgroundColor: '#F3F4F6',
      color: '#DC2626',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: 14,
      fontFamily: 'monospace',
    },
    code_block: {
      backgroundColor: '#F9FAFB',
      color: '#374151',
      padding: 16,
      borderRadius: 8,
      fontSize: 14,
      fontFamily: 'monospace',
      marginVertical: 12,
      borderLeftWidth: 4,
      borderLeftColor: '#E5E7EB',
    },
    bullet_list: {
      marginVertical: 8,
    },
    ordered_list: {
      marginVertical: 8,
    },
    list_item: {
      marginVertical: 2,
    },
    blockquote: {
      backgroundColor: '#F9FAFB',
      borderLeftWidth: 4,
      borderLeftColor: '#D1D5DB',
      paddingLeft: 16,
      paddingVertical: 8,
      marginVertical: 8,
      fontStyle: 'italic',
      color: '#6B7280',
    },
    link: {
      color: '#2563EB',
      textDecorationLine: 'underline',
    },
    table: {
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 8,
      marginVertical: 12,
    },
    thead: {
      backgroundColor: '#F9FAFB',
    },
    tbody: {
      backgroundColor: '#FFFFFF',
    },
    th: {
      padding: 12,
      borderWidth: 1,
      borderColor: '#D1D5DB',
      fontWeight: '600',
      color: '#374151',
    },
    td: {
      padding: 12,
      borderWidth: 1,
      borderColor: '#D1D5DB',
      color: '#374151',
    },
    hr: {
      backgroundColor: '#E5E7EB',
      height: 1,
      marginVertical: 16,
    },
    ...style,
  };

  return (
    <View className="flex-1">
      <Markdown style={markdownStyles}>
        {content}
      </Markdown>
    </View>
  );
};

export default MarkdownRenderer;
