import React from "react";

interface Props {
    text: React.ReactNode;
    /** Which edge of the icon the tooltip box is anchored to horizontally. */
    align?: "left" | "right";
    /** Whether the tooltip opens above or below the icon. */
    side?: "top" | "bottom";
}

export function InfoTooltip({ text, align = "right", side = "top" }: Props) {
    const verticalPos = side === "top" ? "bottom-full mb-2" : "top-full mt-2";
    const arrowVertical = side === "top" ? "top-full -mt-1" : "bottom-full -mb-1";
    const horizontalPos = align === "left" ? "left-0" : "right-0";
    const arrowHorizontal = align === "left" ? "left-2" : "right-2";

    return (
        <div className="relative group inline-flex shrink-0">
            <button
                type="button"
                tabIndex={-1}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center text-slate-400 hover:text-[#f06455] transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
            </button>
            <div className={`absolute ${verticalPos} ${horizontalPos} w-72 bg-white text-slate-700 text-[11px] rounded-lg p-3 shadow-xl border border-slate-200 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 leading-relaxed`}>
                {text}
                <div className={`absolute ${arrowVertical} ${arrowHorizontal} w-2 h-2 bg-white border-slate-200 rotate-45`} />
            </div>
        </div>
    );
}
