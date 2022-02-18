async function checkInGroup (req, res, next) {
  // req.user.uid
  // res.group
  try {
    const doc = await res.group.get();
    const { members } = doc.data();
    const found = members.find((member) => member === req.user.uid);
    if (!found) { return res.status(403).json({ message: "User not in group; does not have permission to run this endpoint." }); }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
}

exports.check = checkInGroup;
