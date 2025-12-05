
export const generateToken = (req, res) => {
  try {
    const { clearkId, name, imageUrl } = req.user;
    // Generate Stream token for the user based on their Clerk ID not database ID because we used Clerk ID in Stream
    const token = chatClient.createToken(clearkId);
    res.json({ token, user: { id: clearkId, name, image: imageUrl } });
  } catch (error) {
    console.error("Error generating Stream token:", error);
    next(error);
  }
};
