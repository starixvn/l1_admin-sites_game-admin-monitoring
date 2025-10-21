import React from "react";
import type { ClusterWin } from "../types";

interface ClusterWinInputProps {
  clusterWin: ClusterWin;
  onUpdate: (updatedClusterWin: ClusterWin) => void;
  onDelete: () => void;
}

const ClusterWinInput: React.FC<ClusterWinInputProps> = ({
  clusterWin,
  onUpdate,
  onDelete,
}) => {
  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const symbol = parseInt(e.target.value) || -1;
    onUpdate({ ...clusterWin, symbol });
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value) || -1;
    onUpdate({ ...clusterWin, size });
  };

  return (
    <div className="cluster-win-input">
      <div className="input-group">
        <label>Symbol:</label>
        <input
          type="number"
          value={clusterWin.symbol === -1 ? "" : clusterWin.symbol}
          onChange={handleSymbolChange}
          placeholder="Symbol"
          min="0"
        />
      </div>
      <div className="input-group">
        <label>Size:</label>
        <input
          type="number"
          value={clusterWin.size === -1 ? "" : clusterWin.size}
          onChange={handleSizeChange}
          placeholder="Cluster Size"
          min="1"
        />
      </div>
      <button className="delete-btn btn-control" onClick={onDelete}>
        X
      </button>
    </div>
  );
};

export default ClusterWinInput;
