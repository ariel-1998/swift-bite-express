import React from "react";
import queryKeys from "../../../utils/queryKeys";
import { MenuItemJoinedWCategory } from "../../../models/MenuItem";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { generateCldResizedImage } from "../../../utils/cloudinaryConfig";
import { AdvancedImage } from "@cloudinary/react";

type OwnerMenuItemCardProps = {
  //   menuItem: MenuItemJoinedWCategory;
};

const OwnerMenuItemCard: React.FC<OwnerMenuItemCardProps> = ({}) => {
  //   const {} = menuItem;
  //   const img = generateCldResizedImage(
  //     menuItem.imgPublicId,
  //     "logo",
  //     thumbnail().width(50).height(50)
  //   );

  return (
    <div className="border p-2 rounded-md flex gap-2">
      {/* <AdvancedImage cldImg={img} className={"border-r"} /> */}
      <div className="flex flex-col">
        {/* <div className="font-bold text-lg">{menuItem.name}</div> */}
        <div>awjdkjlkasn aijsljaslkkj asdlkj</div>
        <div></div>
      </div>
    </div>
  );
};

export default OwnerMenuItemCard;
