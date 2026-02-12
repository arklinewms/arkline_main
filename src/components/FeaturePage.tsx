import { LucideIcon } from 'lucide-react';

interface FeaturePageProps {
  featureNumber: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeaturePage({ featureNumber, icon: Icon, title, description }: FeaturePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-500 text-lg">{description}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Dashboard Integration Ready</h3>
                <p className="text-gray-600">
                  This section is prepared for your custom dashboard integration. Connect your analytics,
                  data visualizations, and key metrics here.
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Data</h3>
                <p className="text-gray-600">
                  Monitor live updates and track performance metrics in real-time. Get instant insights
                  into your warehouse operations.
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Reports</h3>
                <p className="text-gray-600">
                  Generate detailed reports tailored to your business needs. Export data in multiple
                  formats for further analysis.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced Analytics</h3>
                <p className="text-gray-600">
                  Leverage powerful analytics tools to optimize your warehouse operations and make
                  data-driven decisions.
                </p>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  Your Dashboard Goes Here
                </h3>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  This is a placeholder area for Feature {featureNumber}. Integrate your custom dashboards,
                  charts, tables, and interactive components in this space to create a fully functional
                  warehouse management feature.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
