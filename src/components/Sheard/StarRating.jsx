import { useState } from "react";
import Rating from "react-rating-stars-component";
import { Star } from "lucide-react";

const StarRating = ({ 
  rating, 
  setRating, 
  size = 24,
  edit = false,
  isHalf = false,
  count = 5
}) => {
  const [currentRating, setCurrentRating] = useState(rating || 0);

  const ratingChanged = (newRating) => {
    setCurrentRating(newRating);
    if (setRating) {
      setRating(newRating);
    }
  };

  return (
    <Rating
      count={count}
      value={currentRating}
      onChange={ratingChanged}
      size={size}
      activeColor="#fbbf24"
      isHalf={isHalf}
      edit={edit}
      emptyIcon={<Star size={size} className="text-gray-300" />}
      halfIcon={<Star size={size} className="text-gray-300" />}
      filledIcon={<Star size={size} className="text-yellow-400 fill-yellow-400" />}
    />
  );
};

export default StarRating;
