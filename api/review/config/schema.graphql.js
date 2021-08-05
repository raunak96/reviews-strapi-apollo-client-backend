const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  definition: ``,
  query: `
    myReviews(username:String!) : [Review]
  `,
  type: {},
  resolver: {
    Query: {
      myReviews: {
        description: "Return all reviews of authenticated user ",
        policies: ["plugins::users-permissions.isAuthenticated"], // Apply the 'isAuthenticated' policy of the `Users & Permissions` plugin
        resolverOf: "application::review.review.find",
        resolver: async (obj, option, { context }) => {
          const user = context.state.user;
          if (!user) {
            throw new Error("You are not authenticated");
          }
          const reviews = await strapi.services.review.find({
            user: user.id,
          });
          return sanitizeEntity(reviews, { model: strapi.models.review });
        },
      },
    },
  },
};
