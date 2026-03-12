type ResultProps = {
  result: string;
  prediction: number;
  probability: number;
};

export default function ResultCard({ result, prediction, probability }: ResultProps) {
  const isDiabetic = prediction === 1;

  return (
    <div className={`mt-8 p-6 rounded-2xl border text-center transition-all ${
      isDiabetic
        ? 'bg-red-50 border-red-200 text-red-700'
        : 'bg-green-50 border-green-200 text-green-700'
    }`}>
      <div className="text-4xl mb-2">{isDiabetic ? '⚠️' : '✅'}</div>
      <h2 className="text-2xl font-bold">{result}</h2>
      <p className="mt-2 text-lg font-medium">Probability: {probability}%</p>
    </div>
  );
}