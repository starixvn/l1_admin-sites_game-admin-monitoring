import React from "react";
import type { Tumble, ClusterWin } from "../types";
import ClusterWinInput from "./ClusterWinInput";

interface TumbleInputProps {
  tumble: Tumble;
  onUpdate: (updatedTumble: Tumble) => void;
  onDelete: () => void;
}

const TumbleInput: React.FC<TumbleInputProps> = ({
  tumble,
  onUpdate,
  onDelete,
}) => {
  const addClusterWin = () => {
    const newClusterWin: ClusterWin = {
      symbol: 0,
      size: 1,
    };
    onUpdate({
      ...tumble,
      clusterWin: [...tumble.clusterWin, newClusterWin],
    });
  };

  const updateClusterWin = (index: number, updatedClusterWin: ClusterWin) => {
    const updatedClusterWins = [...tumble.clusterWin];
    updatedClusterWins[index] = updatedClusterWin;
    onUpdate({
      ...tumble,
      clusterWin: updatedClusterWins,
    });
  };

  const deleteClusterWin = (index: number) => {
    const updatedClusterWins = tumble.clusterWin.filter((_, i) => i !== index);
    onUpdate({
      ...tumble,
      clusterWin: updatedClusterWins,
    });
  };

  return (
    <div className="tumble-input">
      <div className="tumble-header">
        <h4>
          Tumble{" "}
          {tumble.clusterWin.length > 0
            ? `(${tumble.clusterWin.length} cluster wins)`
            : ""}
        </h4>
        <button className="add-btn btn-control" onClick={addClusterWin}>
          Add Cluster Win
        </button>
        <button className="delete-btn btn-control" onClick={onDelete}>
          X
        </button>
      </div>
      <div className="cluster-win-list">
        {tumble.clusterWin.map((clusterWin, index) => (
          <ClusterWinInput
            key={index}
            clusterWin={clusterWin}
            onUpdate={(updatedClusterWin) =>
              updateClusterWin(index, updatedClusterWin)
            }
            onDelete={() => deleteClusterWin(index)}
          />
        ))}
        {tumble.clusterWin.length === 0 && (
          <p className="empty-message">
            No cluster wins added yet. Click "Add Cluster Win" to get started.
          </p>
        )}
      </div>
    </div>
  );
};

export default TumbleInput;
