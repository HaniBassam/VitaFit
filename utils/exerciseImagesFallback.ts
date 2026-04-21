export function getExerciseImage(exercise: any) {
  if (exercise.image_url) {
    return exercise.image_url;
  }

  return getFallbackImage(exercise.category);
}

function getFallbackImage(category: any) {
  switch (category) {
    case "Chest":
      return require("@/assets/images/chest.png");
    case "Back":
      return require("@/assets/images/back.png");
    case "Arms":
      return require("@/assets/images/arms.webp");
    case "Legs":
      return require("@/assets/images/legs.png");
    default:
      return require("@/assets/images/default.png");
  }
}
