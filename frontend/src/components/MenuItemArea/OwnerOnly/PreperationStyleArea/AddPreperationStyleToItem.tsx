import React, { KeyboardEvent, MouseEvent, useState } from "react";
import Input from "../../../Customs/Input";
import HorizontalList from "../../../Customs/HorizontalList";
import HorizontalListItem from "../../../Customs/HorizontalListItem";
import Button from "../../../Customs/Button";
import { preparationStyleSchema } from "../../../../models/MenuItemPreparationStyle";
import { ZodError } from "zod";
import { FaCircleQuestion } from "react-icons/fa6";

type AddPreperationStyleToItemProps = {
  setStyles: React.Dispatch<React.SetStateAction<string[]>>;
  styles: string[];
  label?: string;
};

const AddPreperationStyleToItem: React.FC<AddPreperationStyleToItemProps> = ({
  setStyles,
  styles,
  label,
}) => {
  const [optVal, setOptVal] = useState("");
  const [error, setError] = useState("");

  function addStyleToList() {
    try {
      preparationStyleSchema.parse(optVal);
      setError("");
      setStyles((prev) => [...new Set([...prev, optVal])]);
      setOptVal("");
    } catch (error) {
      setError((error as ZodError).issues[0].message);
    }
  }

  function removeStyle(style: string) {
    setStyles((prev) => prev.filter((sty) => sty !== style));
  }

  const onClickEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addStyleToList();
    }
  };

  return (
    <div>
      {!!styles.length && (
        <HorizontalList>
          {styles.map((sty) => (
            <HorizontalListItem
              key={sty}
              output={sty}
              onClick={() => removeStyle(sty)}
            />
          ))}
        </HorizontalList>
      )}

      <div className="flex flex-col">
        <div className="flex gap-2 items-center">
          <label>{label || "Preparation Style Options:"}</label>
          <ExplanationDiv />
        </div>
        <div className="flex">
          <div className="w-full">
            <Input
              type="text"
              value={optVal}
              onChange={(e) => setOptVal(e.target.value)}
              className="rounded-r-none"
              onKeyDown={onClickEnter}
            />
          </div>
          <Button
            size={"default"}
            type="button"
            onClick={addStyleToList}
            className="rounded-none rounded-r"
          >
            Add
          </Button>
        </div>
        {error && <div className="text-error">{error}</div>}
      </div>
    </div>
  );
};

export default AddPreperationStyleToItem;

function ExplanationDiv() {
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handelMouseEnter = (e: MouseEvent) => {
    setIsExplanationOpen(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };
  const handelMouseLeave = () => setIsExplanationOpen(false);

  const leftPosition = Math.min(position.x, window.innerWidth - 300);
  const topPosition = Math.min(position.y, window.innerHeight - 150);
  return (
    <div className="relative">
      <i onMouseEnter={handelMouseEnter} onMouseLeave={handelMouseLeave}>
        <FaCircleQuestion className="text-secondary-border " />
      </i>
      {isExplanationOpen && (
        <div
          className={`absolute bg-secondary-hover top-${topPosition} w-[250px] left-${leftPosition} text-sm p-2`}
        >
          <div>You can add different varients for menu item, example:</div>
          <div className="font-semibold text-center">Chicken Wings</div>
          <ul className="list-decimal m-0 list-inside">
            <li>Barbecue Sauce</li>
            <li>Garlic Sauce</li>
            <li>Teriyaki Sauce</li>
            <li>Honey Mustard Sauce</li>
            <li>etc...</li>
          </ul>
        </div>
      )}
    </div>
  );
}
