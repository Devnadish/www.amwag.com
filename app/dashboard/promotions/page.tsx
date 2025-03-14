import React from "react";
import AddOfferForm from "./components/AddOffer";
import { getOfferCategory } from "./actions/Actions";

async function page() {
  // Fetch categories from the backend
  const offerCategory = await getOfferCategory();

  return (
    <div>
      <AddOfferForm suppliers={offerCategory} />
    </div>
  );
}

export default page;
