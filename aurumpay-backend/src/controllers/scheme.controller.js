const schemeService = require("../services/scheme.service");

exports.list = async (req, res, next) => {
  try {
    const schemes = await schemeService.list();
    res.json({ success: true, schemes });
  } catch (err) {
    next(err);
  }
};

exports.join = async (req, res, next) => {
  try {
    const { schemeId } = req.body;
    const result = await schemeService.join(req.user.id, schemeId);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};
