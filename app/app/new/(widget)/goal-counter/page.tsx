import { GoalCounterForm } from "@/components/app-setup/forms/goal-counter/goal-counter";
import { MotionImage } from "@/components/motion-components";

export default function CounterNewWidgetPage() {
    return (<>
        <div className="flex flex-col items-center md:mt-20 mt-2 text-center md:pb-20 pb-10">
            <div className="h-72 relative w-full">
                <MotionImage
                    src="/workout-widget.svg"
                    alt={`Goal counter widget showcase`}
                    layoutId={`goal-counter-image`}
                    fill
                />
            </div>
            <h2 className="text-xl mt-4 tracking-tight">Goal counter</h2>
            <p className="max-w-[80ch] text-muted-foreground">Track your progress with basic counter. Perfect to keep workouts, things to collect etc.</p>
        </div>
        <GoalCounterForm />
    </>)
}