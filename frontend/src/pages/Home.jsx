import React from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiHeart,
  FiMapPin,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "Community Connection",
      description:
        "Connect with neighbors and build meaningful relationships in your community.",
    },
    {
      icon: <FiHeart className="w-8 h-8" />,
      title: "Help Others",
      description:
        "Offer assistance to those in need and make a positive impact in your neighborhood.",
    },
    {
      icon: <FiMapPin className="w-8 h-8" />,
      title: "Location-Based",
      description:
        "Find help requests and offers in your immediate area for convenience and safety.",
    },
    {
      icon: <FiClock className="w-8 h-8" />,
      title: "Real-Time",
      description:
        "Get instant notifications and updates on help requests and responses.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto animate-fadeIn">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Welcome to NeighborhoodHelp
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Connecting communities, one favor at a time. Build stronger
              neighborhoods through mutual support and kindness.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn btn-primary text-lg px-8 py-4 flex items-center space-x-2 group"
                >
                  <span>Go to Dashboard</span>
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="btn btn-primary text-lg px-8 py-4 flex items-center space-x-2 group"
                >
                  <span>Get Started</span>
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>

            {/* How It Works Section */}
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  How It Works
                </h3>
                <p className="text-gray-600">
                  Simple steps to connect with your community
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">
                    Post a Request
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Need help with something? Simply post your request with
                    location details and let neighbors know how they can assist.
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">
                    Get Responses
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Nearby neighbors will see your request and can offer their
                    help. You'll receive notifications when someone responds.
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">
                    Connect & Help
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Choose the best helper, connect with them, and get the
                    assistance you need while building stronger community bonds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose NeighborhoodHelp?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to give and receive help within your
              community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-8 text-center group hover:scale-105 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Highlights Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Community Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how our community is making a real difference every day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center text-white mr-4">
                  <FiHeart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Sarah M.</h3>
                  <p className="text-gray-600 text-sm">Downtown Resident</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "NeighborhoodHelp connected me with a neighbor who helped me
                move my furniture. What would have taken me hours, we completed
                in 30 minutes together!"
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white mr-4">
                  <FiUsers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Mike R.</h3>
                  <p className="text-gray-600 text-sm">Suburban Community</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "I needed help with my garden, and within an hour, three
                neighbors offered their expertise. The community spirit here is
                amazing!"
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center text-white mr-4">
                  <FiClock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Emma L.</h3>
                  <p className="text-gray-600 text-sm">Apartment Complex</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "When my car broke down, I posted for help and someone came
                within 15 minutes to give me a ride. This platform truly brings
                neighbors together!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of neighbors who are already helping each other
              every day.
            </p>
            {!user && (
              <Link
                to="/register"
                className="btn btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2 group"
              >
                <span>Start Helping Today</span>
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
