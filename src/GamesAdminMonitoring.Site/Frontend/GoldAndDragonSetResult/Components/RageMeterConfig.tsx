import React from "react";
import type { RageMeterConfig as RageConfig } from "../types";
import RageMeterBar from "./RageMeterBar";

interface RageMeterConfigProps {
  rageMeter: number;
  onRageMeterChange: (value: number) => void;
  config: RageConfig;
}

const RageMeterConfig: React.FC<RageMeterConfigProps> = ({
  rageMeter,
  onRageMeterChange,
  config,
}) => {
  return (
    <div className="rage-meter-config-simple">
      <div className="rage-meter-input-simple">
        <label htmlFor="rage-meter">Rage Meter:</label>
        <input
          id="rage-meter"
          type="number"
          value={rageMeter === -1 ? "" : rageMeter}
          onChange={(e) => onRageMeterChange(parseInt(e.target.value) || -1)}
          placeholder="Enter rage meter value"
          min="0"
        />
      </div>

      <RageMeterBar rageMeter={rageMeter} config={config} />
    </div>
  );
};

export default RageMeterConfig;
