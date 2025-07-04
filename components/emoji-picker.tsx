'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
    EmojiPicker as EmojiPickerComponent,
    EmojiPickerSearch,
    EmojiPickerContent,
    EmojiPickerFooter,
} from "@/components/ui/emoji-picker";
import { useState } from "react";


type EmojiPickerProps = {
    value?: string | null;
    onChange?: (emoji: string) => void;
    alternativeEmojiText?: string;
};

export const EmojiPicker = ({ value, onChange, alternativeEmojiText }: EmojiPickerProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Popover onOpenChange={setIsOpen} open={isOpen}>
            <PopoverTrigger asChild>
                <div className="flex gap-x-4 w-fit cursor-pointer">
                    <span className="shadow-notion border-input rounded-md p-2 text-md">{value
                        || (alternativeEmojiText && alternativeEmojiText.slice(0, 2).toUpperCase())
                        || 'N/A'}</span>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
                <EmojiPickerComponent
                    className="h-[342px]"
                    onEmojiSelect={({ emoji }) => {
                        setIsOpen(false)
                        onChange?.(emoji)
                    }}
                >
                    <EmojiPickerSearch />
                    <EmojiPickerContent />
                    <EmojiPickerFooter />
                </EmojiPickerComponent>
            </PopoverContent>
        </Popover>
    )
}