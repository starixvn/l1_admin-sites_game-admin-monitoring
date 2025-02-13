import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arraySwap,
  rectSwappingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Deck } from "./deck";

export type DeckData = {
  slot1: number[];
  slot2: number[];
  slot3: number[];
  slot4: number[];
};

interface SortableSegmentCardProps {
  handleOnCardChanges: (data: DeckData) => void;
  initCards: string[];
}

export interface SortableDeckRef {
  setCards: (cards: number[]) => void;
}

function SortableHandCardInner(
  { handleOnCardChanges, initCards }: SortableSegmentCardProps,
  ref: Ref<{ setCards: (cards: number[]) => void }>
) {
  useImperativeHandle(
    ref,
    () => ({
      setCards: (cards: number[]) => {
        const newItems = cards.map((card, index) => `${index}:${card}`);
        setItems(newItems);
      },
    }),
    []
  );
  const [items, setItems] = useState(initCards);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const cards = items.map((item) => parseInt(item.split(":")[1]));
    const slotSize = cards.length / 4;
    const data = {
      slot1: cards.slice(0, slotSize),
      slot2: cards.slice(slotSize, slotSize * 2),
      slot3: cards.slice(slotSize * 2, slotSize * 3),
      slot4: cards.slice(slotSize * 3, slotSize * 4),
    };
    handleOnCardChanges(data);
  }, [items]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        const newItems = arraySwap(items, oldIndex, newIndex);

        return newItems;
      });
    }
  };
  return (
    <DndContext
      id="dnd"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={rectSwappingStrategy}>
        <Deck cards={items}></Deck>
      </SortableContext>
    </DndContext>
  );
}

export const SortableHandCard = forwardRef(SortableHandCardInner);
