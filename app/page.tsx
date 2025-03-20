import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, getBinanceUser } from "@/app/services/binance";

interface Currency {
  id: string;
  symbol: string;
}

interface SpotAsset {
  coin: string;
  balance: number;
  value: number;
  change24h: number;
  priceAlert: {
    high: number;
    low: number;
  };
}

interface FuturesPosition {
  symbol: string;
  side: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  roe: string;
  leverage: number;
}

interface UsdtFuturesData {
  totalEquity: number;
  availableBalance: number;
  marginBalance: number;
  unrealizedPnL: number;
  positions: FuturesPosition[];
}

// Mock data
const mockCurrencies: Currency[] = [
  { id: 'USD', symbol: '$' },
  { id: 'CNY', symbol: '¥' },
  { id: 'EUR', symbol: '€' },
];

const mockSpotAssets: SpotAsset[] = [
  {
    coin: 'BTC',
    balance: 0.5,
    value: 20000,
    change24h: 2.5,
    priceAlert: {
      high: 45000,
      low: 35000,
    },
  },
  {
    coin: 'ETH',
    balance: 5,
    value: 10000,
    change24h: -1.2,
    priceAlert: {
      high: 2500,
      low: 1800,
    },
  },
];

const mockUsdtFutures: UsdtFuturesData = {
  totalEquity: 50000,
  availableBalance: 30000,
  marginBalance: 40000,
  unrealizedPnL: 1500,
  positions: [
    {
      symbol: 'BTCUSDT',
      side: 'LONG',
      size: 0.1,
      entryPrice: 40000,
      markPrice: 41000,
      pnl: 100,
      roe: '2.5',
      leverage: 10,
    },
    {
      symbol: 'ETHUSDT',
      side: 'SHORT',
      size: 1,
      entryPrice: 2200,
      markPrice: 2150,
      pnl: 50,
      roe: '1.2',
      leverage: 5,
    },
  ],
};

export default async function Home() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  const binanceUser = await getBinanceUser(user.id);
  const hasApiKey = binanceUser?.api_key && binanceUser?.secret_key;

  if (!hasApiKey) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-lg">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">绑定币安 API</h2>
          <p className="text-gray-600">
            {binanceUser ? '当前账户未绑定API，请先绑定您的币安API' : '请先绑定您的币安API，以便我们为您提供更好的服务'}
          </p>
          <Link
            href="/bind-api"
            className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 
                     hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg 
                     shadow-md hover:shadow-lg transition-all duration-300"
          >
            {binanceUser ? '绑定新账户' : '立即绑定'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 p-4">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent animate-gradient">
          币安交易面板
        </h1>
        <p className="text-gray-600 mt-2">实时掌控您的加密资产</p>
      </div>

      {/* Currency Selector */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
          <span className="inline-block w-1 h-6 bg-blue-500 rounded animate-pulse"></span>
          计价货币
        </h2>
        <div className="flex gap-4 flex-wrap">
          {mockCurrencies.map((currency) => (
            <button
              key={currency.id}
              className="px-6 py-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-all duration-300
                       border border-gray-200 text-gray-700 hover:text-blue-600 hover:scale-105
                       shadow-sm hover:shadow-md"
            >
              <span className="text-lg">{currency.symbol}</span>
              <span className="ml-2 font-medium">{currency.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Spot Assets */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
          <span className="inline-block w-1 h-6 bg-blue-500 rounded animate-pulse"></span>
          现货资产
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {mockSpotAssets.map((asset) => (
            <div
              key={asset.coin}
              className="group bg-gray-50 rounded-lg p-6 border border-gray-200
                         hover:border-blue-200 transition-all duration-300 hover:shadow-lg
                         hover:transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center
                                group-hover:bg-blue-200 transition-colors duration-300">
                    <span className="font-bold text-blue-600">{asset.coin[0]}</span>
                  </div>
                  <span className="text-lg font-bold text-gray-800">{asset.coin}</span>
                </div>
                <span className={`text-sm px-3 py-1 rounded-full ${
                  asset.change24h >= 0 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {asset.change24h > 0 ? '+' : ''}{asset.change24h}%
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 rounded bg-white group-hover:bg-blue-50 transition-colors duration-300">
                  <span className="text-gray-600">余额</span>
                  <span className="font-medium text-gray-800">{asset.balance}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-white group-hover:bg-blue-50 transition-colors duration-300">
                  <span className="text-gray-600">价值</span>
                  <span className="font-medium text-gray-800">${asset.value.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-white group-hover:bg-blue-50 transition-colors duration-300">
                  <span className="text-gray-600">价格提醒</span>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-green-100 text-green-600">
                      H: ${asset.priceAlert.high}
                    </span>
                    <span className="px-2 py-1 rounded bg-red-100 text-red-600">
                      L: ${asset.priceAlert.low}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* USDT Futures */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
          <span className="inline-block w-1 h-6 bg-blue-500 rounded animate-pulse"></span>
          U本位合约
        </h2>
        
        {/* Account Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "账户权益", value: mockUsdtFutures.totalEquity, isPositive: true },
            { label: "可用余额", value: mockUsdtFutures.availableBalance, isPositive: true },
            { label: "保证金余额", value: mockUsdtFutures.marginBalance, isPositive: true },
            { label: "未实现盈亏", value: mockUsdtFutures.unrealizedPnL, isPositive: mockUsdtFutures.unrealizedPnL > 0 }
          ].map((item, index) => (
            <div key={index} 
                 className="bg-gray-50 rounded-lg p-6 border border-gray-200
                          hover:border-blue-200 transition-all duration-300 hover:shadow-lg
                          hover:transform hover:-translate-y-1">
              <div className="text-sm text-gray-600 mb-2">{item.label}</div>
              <div className={`text-xl font-bold ${item.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {item.value >= 0 ? '+' : '-'}${Math.abs(item.value).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Positions */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-4 px-4 text-gray-600 font-medium">合约</th>
                <th className="text-left py-4 px-4 text-gray-600 font-medium">方向</th>
                <th className="text-right py-4 px-4 text-gray-600 font-medium">持仓量</th>
                <th className="text-right py-4 px-4 text-gray-600 font-medium">开仓价</th>
                <th className="text-right py-4 px-4 text-gray-600 font-medium">标记价格</th>
                <th className="text-right py-4 px-4 text-gray-600 font-medium">未实现盈亏</th>
                <th className="text-right py-4 px-4 text-gray-600 font-medium">ROE</th>
                <th className="text-right py-4 px-4 text-gray-600 font-medium">杠杆</th>
              </tr>
            </thead>
            <tbody>
              {mockUsdtFutures.positions.map((position) => (
                <tr key={position.symbol} 
                    className="border-t border-gray-100 hover:bg-blue-50 transition-colors duration-200">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="font-bold text-blue-600">{position.symbol[0]}</span>
                      </div>
                      <span className="font-medium text-gray-800">{position.symbol}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      position.side === 'LONG'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {position.side}
                    </span>
                  </td>
                  <td className="text-right py-4 px-4 font-medium text-gray-800">{position.size}</td>
                  <td className="text-right py-4 px-4 font-medium text-gray-800">${position.entryPrice.toLocaleString()}</td>
                  <td className="text-right py-4 px-4 font-medium text-gray-800">${position.markPrice.toLocaleString()}</td>
                  <td className={`text-right py-4 px-4 font-bold ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${position.pnl.toLocaleString()}
                  </td>
                  <td className={`text-right py-4 px-4 font-bold ${parseFloat(position.roe) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {position.roe}%
                  </td>
                  <td className="text-right py-4 px-4">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm">
                      {position.leverage}x
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
