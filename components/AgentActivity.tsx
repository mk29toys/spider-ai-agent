"use client";
import { CheckCircle2, Circle, LoaderCircle, Radar, } from "lucide-react";
const steps = [ "Initializing Spider Agent...", "Fetching market data...", "Scanning price action...", "Calculating RSI & moving averages...", "Analyzing momentum...", "Checking market volatility...", "Evaluating risk...", "Generating Spider signal...", "Analysis complete", ];
type AgentActivityProps = { running: boolean; currentStep: number; };
export default function AgentActivity({ running, currentStep, }: AgentActivityProps) { return ( <div className="rounded-2xl border border-white/10 bg-[#0c0c0c] p-6"> <div className="mb-6 flex items-center justify-between"> <div> <p className="text-sm text-gray-500">Spider Network</p>
      <h2 className="mt-1 flex items-center gap-2 text-xl font-semibold">
        <Radar className="text-yellow-400" size={20} />
        Agent Activity
      </h2>
    </div>

    <div className="flex items-center gap-2 text-xs text-green-400">
      <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
      ONLINE
    </div>
  </div>

  <div className="space-y-4">
    {steps.map((step, index) => {
      const completed =
        currentStep > index ||
        (!running &&
          currentStep === steps.length - 1 &&
          index === steps.length - 1);

      const active = running && currentStep === index;

      return (
        <div key={step} className="flex items-center gap-3">
          {completed ? (
            <CheckCircle2
              size={18}
              className="text-green-400"
            />
          ) : active ? (
            <LoaderCircle
              size={18}
              className="animate-spin text-yellow-400"
            />
          ) : (
            <Circle
              size={18}
              className="text-white/20"
            />
          )}

          <span
            className={`text-sm ${
              completed
                ? "text-gray-300"
                : active
                ? "text-yellow-400"
                : "text-gray-600"
            }`}
          >
            {step}
          </span>
        </div>
      );
    })}
</div>

  {running && (
    <div className="mt-6 rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4">
      <div className="flex items-center gap-3">
        <LoaderCircle
          size={18}
          className="animate-spin text-yellow-400"
        />

        <div>
          <p className="text-sm font-medium text-yellow-400">
            Spider AI is working
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Processing live market intelligence...
          </p>
        </div>
      </div>
    </div>
  )}
</div>
); }