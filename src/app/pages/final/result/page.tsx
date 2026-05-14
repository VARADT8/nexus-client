"use client"
import Gemini from "@/app/components/Gemini";
import { predictedState } from "@/lib/utils";
import {
    useRecoilValue,
} from 'recoil';
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResultContent() {

    const recoilPredictedClass = useRecoilValue(predictedState);
    const searchParams = useSearchParams();
    const urlPredictedClass = searchParams.get("predictedClass");

    // Use URL param as primary source, fall back to Recoil state
    const predictedClass = urlPredictedClass ?? recoilPredictedClass;

    return (
        <div className="h-4/5">
            <Gemini predictedClass={predictedClass} />
        </div>
    );
}

export default function Result() {
    return (
        <Suspense fallback={<div className="p-14 text-center">Loading...</div>}>
            <ResultContent />
        </Suspense>
    );
}