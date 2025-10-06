import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MarkdownEditorProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  minHeight?: number;
  showPreview?: boolean;
  onPreviewToggle?: (show: boolean) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChangeText,
  placeholder = 'Commencez à écrire votre note en markdown...',
  minHeight = 200,
  showPreview = false,
  onPreviewToggle,
}) => {
  const textInputRef = useRef<TextInput>(null);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const start = selection.start;
    const end = selection.end;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newText = 
      value.substring(0, start) + 
      before + textToInsert + after + 
      value.substring(end);
    
    onChangeText(newText);
    
    // Update cursor position
    const newCursorPos = start + before.length + textToInsert.length + after.length;
    setTimeout(() => {
      textInputRef.current?.setSelection({
        start: newCursorPos,
        end: newCursorPos,
      });
    }, 100);
  };


  const formatButtons = [
    {
      id: 'bold',
      icon: 'md-bold',
      action: () => insertText('**', '**', 'texte en gras'),
      tooltip: 'Gras',
    },
    {
      id: 'italic',
      icon: 'md-italic',
      action: () => insertText('*', '*', 'texte en italique'),
      tooltip: 'Italique',
    },
    {
      id: 'code',
      icon: 'code-outline',
      action: () => insertText('`', '`', 'code'),
      tooltip: 'Code inline',
    },
    {
      id: 'h1',
      icon: 'text-outline',
      action: () => insertText('# ', '', 'Titre principal'),
      tooltip: 'Titre 1',
    },
    {
      id: 'h2',
      icon: 'text-outline',
      action: () => insertText('## ', '', 'Sous-titre'),
      tooltip: 'Titre 2',
    },
    {
      id: 'list',
      icon: 'list-outline',
      action: () => insertText('- ', '', 'Élément de liste'),
      tooltip: 'Liste à puces',
    },
    {
      id: 'link',
      icon: 'link-outline',
      action: () => insertText('[', '](url)', 'texte du lien'),
      tooltip: 'Lien',
    },
    {
      id: 'quote',
      icon: 'quote-outline',
      action: () => insertText('> ', '', 'Citation'),
      tooltip: 'Citation',
    },
  ];

  return (
    <KeyboardAvoidingView 
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1">
        {/* Toolbar */}
        <View className="bg-gray-50 border-b border-gray-200 p-3">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {formatButtons.map((button) => (
              <TouchableOpacity
                key={button.id}
                onPress={button.action}
                className="bg-white border border-gray-300 rounded-lg p-2 mr-2 min-w-[40px] items-center justify-center"
              >
                <Ionicons 
                  name={button.icon as any} 
                  size={18} 
                  color="#374151" 
                />
              </TouchableOpacity>
            ))}
            
            {/* Preview Toggle */}
            {onPreviewToggle && (
              <TouchableOpacity
                onPress={() => onPreviewToggle(!showPreview)}
                className={`border rounded-lg p-2 mr-2 min-w-[40px] items-center justify-center ${
                  showPreview 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <Ionicons 
                  name="eye-outline" 
                  size={18} 
                  color={showPreview ? "#FFFFFF" : "#374151"} 
                />
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Editor */}
        <View className="flex-1">
          <TextInput
            ref={textInputRef}
            className="flex-1 text-base text-gray-900 p-4"
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
            multiline
            textAlignVertical="top"
            style={{ minHeight }}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Help Text */}
        <View className="bg-blue-50 border-t border-blue-200 p-3">
          <Text className="text-blue-700 text-xs">
            💡 Utilisez les boutons ci-dessus pour formater votre texte ou tapez directement en Markdown
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MarkdownEditor;
