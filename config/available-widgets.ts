import { InputHTMLAttributes } from "react";

export interface WidgetFormFieldBase {
    codeName: string;
    label: string;
    description?: string;
    placeholder?: InputHTMLAttributes<HTMLInputElement>['placeholder'];
    type: 'string' | 'number' | 'checkbox';
    optional?: boolean;
}

export interface WidgetFormFieldString extends WidgetFormFieldBase {
    type: 'string';
    defaultValue?: string;
    max?: number;
}
export interface WidgetFormFieldNumber extends WidgetFormFieldBase {
    type: 'number';
    defaultValue?: number;
}
export interface WidgetFormFieldCheckbox extends WidgetFormFieldBase {
    type: 'checkbox';
    defaultValue?: boolean;
}

export type WidgetFormField = WidgetFormFieldString | WidgetFormFieldNumber | WidgetFormFieldCheckbox;

export interface WidgetElement {
    name: string;
    description: string;
    code: string;
    icon: string;
    form: WidgetFormField[];
}

export const widgetsList: WidgetElement[] = [
    {
        name: 'Goal counter',
        description: 'Track your progress with basic counter. Perfect to keep workouts, things to collect etc.',
        code: 'goal-counter',
        icon: '/workout-widget.svg',
        form: [
            {
                codeName: 'title',
                label: 'Provide a name',
                placeholder: 'ex. Pushups',
                type: 'string'
            },
            {
                codeName: 'goal',
                label: 'What is your goal?',
                placeholder: 'ex. 10',
                defaultValue: 30,
                type: 'number'
            },
            {
                codeName: 'icon',
                label: 'Select an icon',
                placeholder: 'ex. 💪',
                defaultValue: '💪',
                type: 'string',
                max: 2,
                optional: true
            },
        ]
    },
    {
        name: 'Goal counter',
        description: 'Track your progress with basic counter. Perfect to keep workouts, things to collect etc.',
        code: 'goal-counter1',
        icon: '/workout-widget.svg',
        form: [
            {
                codeName: 'goal',
                label: 'Goal:',
                description: 'You will receive notifications when your goal is reached.',

                placeholder: 'e.g. My workout',
                defaultValue: 'My workout',
                type: 'string'
            },
            {
                codeName: 'count',
                label: 'Count:',
                placeholder: 'e.g. 5',
                defaultValue: 5,
                type: 'number'
            },
            {
                codeName: 'active',
                label: 'Subscribe to notifications',
                description: 'You will receive notifications when your goal is reached.',
                defaultValue: true,
                type: 'checkbox'
            }
        ]
    },
]