const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
    // type:String,
    // default:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABhUlEQVRYhe3UMWiUMRjG8Z930goq7VC32kkculxF3cRJzlGcxc1BBRcjHYpIRR2K3Cw4u7lVcEgnN0vRmlFQF4uKk0oVFUSHL4dtuft6XIcu+UP4krxP3vchXxIKhUKhsMvsGUTU6rSv4zzG8BJ3U4hvtmimcAsnsY7FFOLCjgy0Ou0JfEIzT63jQO7PphDvZ91lPMjz37F/Q5rDKcS1oQzk5Et4nEJ8mMfjWMERnMY3vMIajqcQP2fdBVxJIZ6qyz/QL+hj7C+e4yvOphCHytV3UavTPoaj+NMj/AO3cQK/8BY3bN76Lk28SyGu9Kqzt8bcJVytiXcZxTSe1mge4WKvQKNmUczfOdVOjed2EPtybBXPcn9MdUC7uiau5dhSvyLb3YIvOfG5FOJinmvgBWbQVp2BZbzGTArxZ9adyYV/pxBHhzVwSHUNG6qz8BGTOXwvhXgz62bRvfMfMIGRPJ5KIb4fysAGI/M2P0R3UoirWzTTmPf/IXqSQpwbJH+hUCgUdpV/POZrJftzy88AAAAASUVORK5CYII=",
    // set:(v) =>
    // v===""
    // ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABhUlEQVRYhe3UMWiUMRjG8Z930goq7VC32kkculxF3cRJzlGcxc1BBRcjHYpIRR2K3Cw4u7lVcEgnN0vRmlFQF4uKk0oVFUSHL4dtuft6XIcu+UP4krxP3vchXxIKhUKhsMvsGUTU6rSv4zzG8BJ3U4hvtmimcAsnsY7FFOLCjgy0Ou0JfEIzT63jQO7PphDvZ91lPMjz37F/Q5rDKcS1oQzk5Et4nEJ8mMfjWMERnMY3vMIajqcQP2fdBVxJIZ6qyz/QL+hj7C+e4yvOphCHytV3UavTPoaj+NMj/AO3cQK/8BY3bN76Lk28SyGu9Kqzt8bcJVytiXcZxTSe1mge4WKvQKNmUczfOdVOjed2EPtybBXPcn9MdUC7uiau5dhSvyLb3YIvOfG5FOJinmvgBWbQVp2BZbzGTArxZ9adyYV/pxBHhzVwSHUNG6qz8BGTOXwvhXgz62bRvfMfMIGRPJ5KIb4fysAGI/M2P0R3UoirWzTTmPf/IXqSQpwbJH+hUCgUdpV/POZrJftzy88AAAAASUVORK5CYII="
    // :v,
  },

  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  // this is a mongoose middleware... whenever you delete a listing , the reviews associated with it should also be deleted , to do that we use post mongoose middleware , so whenever we delete listing , it will delete the reviews in it
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const listings = mongoose.model("listings", listingSchema);

module.exports = listings;
