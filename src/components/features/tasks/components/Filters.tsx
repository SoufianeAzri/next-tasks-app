"use client";

import { Dropdown, Icon, Item, List, Trigger } from "@/components/ui/drop-list";
import { State, User } from "@/utils/types";
import React from "react";
import { cn } from "@/utils/helpers";

interface ListProps {
  _id: number | string;
  title: string;
  value?: string;
}

interface FiltersProps {
  type: "single" | "multiple";
  list: (ListProps | User | State)[];
  selected?: string;
  selectedList?: (number | string)[];
  count?: number;
  onAction: (value: any) => void;
  text?: string | "";
}

export const Filters: React.FC<FiltersProps> = ({
  type,
  list,
  onAction,
  selected,
  selectedList = [],
  count,
  text
}) => {
  // normalize ID and label for either ListProps or User
  const getItemId = (item: ListProps | User | State) =>
    (item as ListProps)._id ?? (item as User).id;

  const getItemLabel = (item: ListProps | User | State) =>
    (item as ListProps).title ?? (item as User).name;


  if (type === "single") {
    return (
      <Dropdown onSelect={onAction}>
        <Trigger className="flex items-center gap-2 min-w-[120px]">
          <p className="text-14-500-s-gray">
            {!selected ? "Select Item" : selected}
          </p>
          <Icon className="arrow mb-0.5" />
        </Trigger>

        <List className="min-w-[120px] w-max right-0">
          {list?.map((v) => (
            <Item
              key={getItemId(v)}
              value={v}
              className="py-2.5 lg:text-14-500-s-gray"
            >
              {getItemLabel(v)}
            </Item>
          ))}
        </List>
      </Dropdown>
    );
  }


  if (type === "multiple") {
    return (
      <Dropdown onSelect={onAction}>
        <Trigger className="flex items-center gap-2">
          <p className="text-14-500-s-gray">
            {!count ? `Filtrer par ${text}` : `${count} ${text} Selectioner`}
          </p>
          <Icon className="arrow mb-0.5" />
        </Trigger>

        <List className="min-w-[160px] w-max right-0 border border-gray-very-light">
          {list?.map((v) => {
            const id = getItemId(v);
            const label = getItemLabel(v);
            const checked = selectedList.includes(id);

            return (
              <Item
                key={id}
                className="flex gap-2 items-start py-2.5 text-14-500-s-gray"
                onClick={() => onAction(id)}
              >
                <input
                  type="checkbox"
                  readOnly
                  checked={checked}
                  className="mt-[1px] cursor-pointer"
                />
                <p>{label}</p>
              </Item>
            );
          })}
        </List>
      </Dropdown>
    );
  }
};
