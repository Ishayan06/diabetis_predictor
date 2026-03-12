'use client';

import { useState } from 'react';
import ResultCard from '../components/resultCard';

const FIELDS = [
  { id: 'Pregnancies', label: 'Pregnancies', placeholder: 'e.g. 2', step: '1' },
  { id: 'Glucose', label: 'Glucose', placeholder: 'e.g. 120', step: '1' },
  { id: 'BloodPressure', label: 'Blood Pressure', placeholder: 'e.g. 70', step: '1' },
  { id: 'SkinThickness', label: 'Skin Thickness', placeholder: 'e.g. 20', step: '1' },
  { id: 'Insulin', label: 'Insulin', placeholder: 'e.g. 80', step: '1' },
  { id: 'BMI', label: 'BMI', placeholder: 'e.g. 25.5', step: '0.1' },
  { id: 'DiabetesPedigreeFunction', label: 'Diabetes Pedigree Function', placeholder: 'e.g. 0.47', step: '0.01' },
  { id: 'Age', label: 'Age', placeholder: 'e.g. 33', step: '1' },
];

type Result = {
  prediction: number;
  probability: number;
  result: string;
};

export default function Home() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (id: string, value: string) => {
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    const features = FIELDS.map(f => parseFloat(form[f.id]));

    if (features.some(isNaN)) {
      setError('Please fill in all fields correctly.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Failed to connect to prediction server.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({});
    setResult(null);
    setError('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🩺</div>
          <h1 className="text-4xl font-bold text-gray-800">Diabetes Predictor</h1>
          <p className="text-gray-500 mt-2">Enter patient details to assess diabetes risk</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FIELDS.map(field => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type="number"
                  step={field.step}
                  placeholder={field.placeholder}
                  value={form[field.id] || ''}
                  onChange={e => handleChange(field.id, e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-800
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                    transition placeholder-gray-300"
                />
              </div>
            ))}
          </div>

          {error && (
            <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50
                text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? 'Predicting...' : 'Predict'}
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-3 border border-gray-200 rounded-xl text-gray-500
                hover:bg-gray-50 transition font-medium"
            >
              Reset
            </button>
          </div>

          {result && (
            <ResultCard
              result={result.result}
              probability={result.probability}
              prediction={result.prediction}
            />
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by Logistic Regression · For educational purposes only
        </p>
      </div>
    </main>
  );
}