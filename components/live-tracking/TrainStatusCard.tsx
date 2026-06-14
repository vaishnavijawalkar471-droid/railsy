"use client";

import { TrainStatus, TelemetryData } from "@/types";

interface TrainStatusCardProps {
  status: TrainStatus | null;
  telemetry: TelemetryData | null;
}

export default function TrainStatusCard({ status, telemetry }: TrainStatusCardProps) {
  if (!status && !telemetry) {
    return (
      <div className="panel p-4">
        <div className="text-xs text-slate-400 uppercase tracking-wider mb-3">Train Status</div>
        <div className="text-sm text-slate-500 italic">Waiting for data...</div>
      </div>
    );
  }

  const getStatusColor = (val: number, low: number, high: number) => {
    if (val >= high) return "text-emerald-400";
    if (val >= low) return "text-saffron dark:text-saffron";
    return "text-red-400";
  };

  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-slate-400 uppercase tracking-wider">Train Status</div>
        {status && (
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${status.driverStatus === "ACTIVE" ? "bg-emerald-400" : "bg-red-400"}`} />
            <span className="text-[10px] text-slate-500">{status.driverStatus}</span>
          </div>
        )}
      </div>

      <div className="space-y-2.5">
        {/* Train ID */}
        {status && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Train ID</span>
            <span className="text-sm font-mono font-medium">{status.trainId}</span>
          </div>
        )}

        {/* Speed */}
        {(status || telemetry) && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Speed</span>
            <span className={`text-sm font-mono font-bold ${getStatusColor(status?.speed ?? 0, 60, 100)}`}>
              {status?.speed ?? telemetry?.speed ?? "—"} km/h
            </span>
          </div>
        )}

        {/* Fuel */}
        {(status || telemetry) && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Fuel</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getStatusColor(status?.fuelLevel ?? 0, 25, 50)}`}
                  style={{ width: `${status?.fuelLevel ?? telemetry?.fuelLevel ?? 0}%`, background: "currentColor" }}
                />
              </div>
              <span className={`text-xs font-mono ${getStatusColor(status?.fuelLevel ?? 0, 25, 50)}`}>
                {status?.fuelLevel ?? telemetry?.fuelLevel ?? "—"}%
              </span>
            </div>
          </div>
        )}

        {/* Engine Health */}
        {status && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Engine</span>
            <span className={`text-sm font-mono ${getStatusColor(status.engineHealth, 60, 80)}`}>
              {status.engineHealth}%
            </span>
          </div>
        )}

        {/* Brake Status */}
        {status && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Brakes</span>
            <span className={`text-sm font-mono ${
              status.brakeStatus === "NORMAL" ? "text-emerald-400" :
              status.brakeStatus === "WARNING" ? "text-saffron dark:text-saffron" :
              "text-red-400"
            }`}>
              {status.brakeStatus}
            </span>
          </div>
        )}

        {/* Track Condition */}
        {status && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Track</span>
            <span className={`text-sm font-mono ${
              status.trackCondition === "GOOD" ? "text-emerald-400" :
              status.trackCondition === "MODERATE" ? "text-saffron dark:text-saffron" :
              "text-red-400"
            }`}>
              {status.trackCondition}
            </span>
          </div>
        )}

        {/* Telemetry additional data */}
        {telemetry && (
          <>
            <div className="border-t border-white/5 my-2" />
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              <div>
                <div className="text-[10px] text-slate-500">Engine Temp</div>
                <div className="text-xs font-mono">{telemetry.engineTemperature}°C</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Battery</div>
                <div className="text-xs font-mono">{telemetry.batteryHealth}%</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Brake Pressure</div>
                <div className="text-xs font-mono">{telemetry.brakePressure}%</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Vibration</div>
                <div className="text-xs font-mono">{telemetry.vibrationLevel} Hz</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}