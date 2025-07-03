const avatarList = [
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Ash",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Flame",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Mystic",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Nova",
  "https://api.dicebear.com/7.x/pixel-art/svg?seed=Buddy",
];

export const getRandomAvatar = () => {
  const index = Math.floor(Math.random() * avatarList.length);
  return avatarList[index];
};
