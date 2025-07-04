export interface WidgetElement {
    name: string;
    description: string;
    code: string;
    icon: string;
}

export const widgetsList: WidgetElement[] = [
    {
        name: 'Goal counter',
        description: 'Track your progress with basic counter. Perfect to keep workouts, things to collect etc.',
        code: 'goal-counter',
        icon: '/workout-widget.svg',
    }
]