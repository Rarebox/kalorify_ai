import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle, X, TrendingUp, Award, Zap, Sparkles, Target, Users, ArrowRight } from 'lucide-react';

// TypeScript interfaces
interface FoodItem {
  name: string;
  portion_g: number;
  calories_kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  method: string;
  dietFit: string[];
  note: string;
  tip: string;
}

interface Totals {
  portion_g: number;
  calories_kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

interface Summary {
  quality?: string;
  overallTip?: string;
  balance?: string;
  general_tip?: string;
}

interface Output {
  items: FoodItem[];
  totals: Totals;
  summary: Summary;
}

interface WebhookResponse {
  output: Output;
}

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<WebhookResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCaptureClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          analyzeImage(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://n8n.birsonraki.net/webhook/test', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: WebhookResponse[] = await response.json();
      setAnalysisResult(data[0]);
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
  };

  const getDietFitColor = (dietFit: string) => {
    const colors: { [key: string]: string } = {
      'vegetarian': 'bg-green-100 text-green-800',
      'vegan': 'bg-emerald-100 text-emerald-800',
      'high-protein': 'bg-blue-100 text-blue-800',
      'low-carb': 'bg-purple-100 text-purple-800',
      'keto': 'bg-indigo-100 text-indigo-800',
      'gluten-free': 'bg-yellow-100 text-yellow-800',
      'dairy-free': 'bg-orange-100 text-orange-800',
      'low-calorie': 'bg-pink-100 text-pink-800',
    };
    return colors[dietFit] || 'bg-gray-100 text-gray-800';
  };

  const translateDietFit = (dietFit: string) => {
    const translations: { [key: string]: string } = {
      'vegetarian': 'Vejetaryen',
      'vegan': 'Vegan',
      'high-protein': 'Yüksek Protein',
      'low-carb': 'Düşük Karbonhidrat',
      'keto': 'Keto',
      'gluten-free': 'Glütensiz',
      'dairy-free': 'Süt Ürünü Yok',
      'low-calorie': 'Düşük Kalori',
      'not vegetarian': 'Vejetaryen Değil',
      'not vegan': 'Vegan Değil',
      'contains gluten': 'Glüten İçerir',
      'high-sugar': 'Yüksek Şeker',
      'not low-calorie': 'Düşük Kalori Değil',
      'paleo': 'Paleo',
      'high-fat': 'Yüksek Yağ',
      'low-fat': 'Düşük Yağ',
      'high-fiber': 'Yüksek Lif',
      'low-sodium': 'Düşük Sodyum',
      'high-sodium': 'Yüksek Sodyum',
    };
    return translations[dietFit] || dietFit;
  };

  const translateFoodName = (foodName: string) => {
    const translations: { [key: string]: string } = {
      'Grilled Ribeye Steak': 'Izgara Ribeye Biftek',
      'Ribeye Steak': 'Ribeye Biftek',
      'Grilled Chicken Breast': 'Izgara Tavuk Göğsü',
      'Mixed Green Salad': 'Karışık Yeşil Salata',
      'Cherry Tomatoes': 'Kiraz Domates',
      'Cheeseburger': 'Hamburger',
      'Lahmacun': 'Lahmacun',
      'Menemen': 'Menemen',
      'Chicken Döner': 'Tavuk Döner',
      'Baklava': 'Baklava',
      'Grilled Salmon': 'Izgara Somon',
      'Caesar Salad': 'Sezar Salatası',
      'French Fries': 'Patates Kızartması',
      'Pizza': 'Pizza',
      'Pasta': 'Makarna',
      'Rice': 'Pilav',
      'Bread': 'Ekmek',
      'Egg': 'Yumurta',
      'Milk': 'Süt',
      'Cheese': 'Peynir',
      'Yogurt': 'Yoğurt',
      'Apple': 'Elma',
      'Banana': 'Muz',
      'Orange': 'Portakal',
      'Strawberry': 'Çilek',
      'Broccoli': 'Brokoli',
      'Carrot': 'Havuç',
      'Spinach': 'Ispanak',
      'Potato': 'Patates',
      'Onion': 'Soğan',
      'Garlic': 'Sarımsak',
      'Tomato': 'Domates',
      'Cucumber': 'Salatalık',
      'Lettuce': 'Marul',
      'Avocado': 'Avokado',
      'Olive Oil': 'Zeytinyağı',
      'Butter': 'Tereyağı',
      'Honey': 'Bal',
      'Sugar': 'Şeker',
      'Salt': 'Tuz',
      'Pepper': 'Karabiber',
      'Grilled Mushrooms': 'Izgara Mantar',
      'Grilled Corn on the Cob': 'Izgara Mısır',
      'Grilled Mixed Vegetables': 'Izgara Karışık Sebze',
    };
    return translations[foodName] || foodName;
  };

  const translateNote = (note: string) => {
    const translations: { [key: string]: string } = {
      'High in protein and essential nutrients like iron and B12, but also high in saturated fat.': 'Demir ve B12 gibi temel besinler açısından zengin, yüksek protein içerir ancak doymuş yağ oranı da yüksektir.',
      'Consider reducing portion size to 200g and trimming visible fat.': 'Porsiyon boyutunu 200g\'a düşürmeyi ve görünür yağları temizlemeyi düşünün.',
      'Excellent lean protein source, low in fat and zero carbs': 'Mükemmel yağsız protein kaynağı, düşük yağ ve sıfır karbonhidrat',
      'Consider using herbs and lemon for seasoning instead of salt': 'Tuz yerine baharat ve limon kullanmayı düşünün',
      'Rich in vitamins, minerals, and fiber': 'Vitamin, mineral ve lif açısından zengin',
      'Add a variety of colorful vegetables for more nutrients': 'Daha fazla besin için renkli sebzeler ekleyin',
      'Good source of vitamin C and antioxidants': 'C vitamini ve antioksidanlar açısından iyi kaynak',
      'Opt for different colored tomatoes for varied antioxidant profiles': 'Farklı antioksidan profilleri için farklı renkli domatesleri tercih edin',
      'High in protein but also high in saturated fat.': 'Yüksek protein içerir ancak doymuş yağ oranı da yüksektir.',
      'Use lean meat or whole-grain bun to reduce calories and improve balance.': 'Kaloriyi azaltmak ve dengeyi iyileştirmek için yağsız et veya tam tahıllı ekmek kullanın.',
      'Rich in carbs due to dough, moderate protein from minced meat.': 'Hamur nedeniyle karbonhidrat açısından zengin, kıyma ile orta düzeyde protein.',
      'Pair with fresh salad and lemon to balance nutrients.': 'Besinleri dengelemek için taze salata ve limon ile eşleştirin.',
      'Egg-based dish high in healthy fats and a good protein source.': 'Sağlıklı yağlar açısından zengin, iyi protein kaynağı yumurta bazlı yemek.',
      'Use less oil or add spinach for extra fiber.': 'Daha az yağ kullanın veya ekstra lif için ıspanak ekleyin.',
      'High in protein, moderate carbs from bread.': 'Yüksek protein, ekmekten orta düzeyde karbonhidrat.',
      'Opt for a salad wrap instead of bread for fewer carbs.': 'Daha az karbonhidrat için ekmek yerine salata wrap tercih edin.',
      'Very high in sugar and fat, low in protein.': 'Çok yüksek şeker ve yağ, düşük protein.',
      'Enjoy in moderation or share a portion.': 'Ölçülü tüketin veya porsiyonu paylaşın.',
      'Low calorie, good source of nutrients and antioxidants': 'Düşük kalori, besin ve antioksidanlar açısından iyi kaynak',
      'Good source of fiber and complex carbohydrates': 'Lif ve kompleks karbonhidratlar açısından iyi kaynak',
      'Low calorie, high in vitamins and minerals': 'Düşük kalori, vitamin ve mineraller açısından zengin',
    };
    return translations[note] || note;
  };

  const translateTip = (tip: string) => {
    const translations: { [key: string]: string } = {
      'Consider reducing portion size to 200g and trimming visible fat.': 'Porsiyon boyutunu 200g\'a düşürmeyi ve görünür yağları temizlemeyi düşünün.',
      'Consider trimming visible fat or reducing portion size to 170g': 'Görünür yağları temizlemeyi veya porsiyon boyutunu 170g\'a düşürmeyi düşünün',
      'Consider using herbs and lemon for seasoning instead of salt': 'Tuz yerine baharat ve limon kullanmayı düşünün',
      'Add a variety of colorful vegetables for more nutrients': 'Daha fazla besin için renkli sebzeler ekleyin',
      'Opt for different colored tomatoes for varied antioxidant profiles': 'Farklı antioksidan profilleri için farklı renkli domatesleri tercih edin',
      'Use lean meat or whole-grain bun to reduce calories and improve balance.': 'Kaloriyi azaltmak ve dengeyi iyileştirmek için yağsız et veya tam tahıllı ekmek kullanın.',
      'Pair with fresh salad and lemon to balance nutrients.': 'Besinleri dengelemek için taze salata ve limon ile eşleştirin.',
      'Use less oil or add spinach for extra fiber.': 'Daha az yağ kullanın veya ekstra lif için ıspanak ekleyin.',
      'Opt for a salad wrap instead of bread for fewer carbs.': 'Daha az karbonhidrat için ekmek yerine salata wrap tercih edin.',
      'Enjoy in moderation or share a portion.': 'Ölçülü tüketin veya porsiyonu paylaşın.',
      'Perfect as is - could even increase portion for more nutrients': 'Mükemmel - daha fazla besin için porsiyonu bile artırabilirsiniz',
      'Consider eating without added butter to reduce fat intake': 'Yağ alımını azaltmak için tereyağı eklemeden yemeyi düşünün',
      'Great choice - consider increasing portion for more vegetables in meal': 'Harika seçim - yemekte daha fazla sebze için porsiyonu artırmayı düşünün',
    };
    return translations[tip] || tip;
  };

  const translateSummary = (summary: string) => {
    const translations: { [key: string]: string } = {
      'High protein and high fat meal with moderate carbs, dominated by the large portion of steak.': 'Büyük biftek porsiyonu ile domine edilen, yüksek protein ve yağ, orta düzeyde karbonhidrat içeren yemek.',
      'High protein and high fat meal with moderate carbs, dominated by the steak portion': 'Biftek porsiyonu ile domine edilen, yüksek protein ve yağ, orta düzeyde karbonhidrat içeren yemek.',
      'To improve balance, reduce steak portion, increase vegetables, and consider adding a whole grain side dish for more balanced nutrition.': 'Dengeyi iyileştirmek için biftek porsiyonunu azaltın, sebzeleri artırın ve daha dengeli beslenme için tam tahıllı yan yemek eklemeyi düşünün.',
      'Consider reducing steak portion and increasing vegetables for better balance, or choose a leaner cut of meat': 'Daha iyi denge için biftek porsiyonunu azaltın ve sebzeleri artırın, veya daha yağsız bir et kesimi seçin',
      'High protein, low carb, moderate fat meal with good nutrition balance': 'İyi beslenme dengesi ile yüksek protein, düşük karbonhidrat, orta düzeyde yağ içeren yemek',
      'Consider adding a small portion of healthy fats like olive oil or avocado to increase satiety and nutrient absorption': 'Doygunluk ve besin emilimini artırmak için zeytinyağı veya avokado gibi sağlıklı yağlar eklemeyi düşünün',
      'High in carbs and fats, moderate protein.': 'Yüksek karbonhidrat ve yağ, orta düzeyde protein.',
      'Add more fresh vegetables or legumes to improve fiber and micronutrient intake.': 'Lif ve mikro besin alımını iyileştirmek için daha fazla taze sebze veya baklagil ekleyin.',
    };
    return translations[summary] || summary;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
        </div>
        
        <div className="relative px-4 py-16 sm:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto text-center">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <span className="ml-4 text-2xl font-bold text-white">Kalorify AI</span>
            </div>
            
            {/* Hero Content */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Yapay Zeka ile
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Beslenme Analizi
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Yemeğinizin fotoğrafını çekin, anında kalori ve besin değerlerini öğrenin. 
              AI teknolojisi ile kişisel beslenme önerileri alın.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button 
                onClick={handleCaptureClick}
                className="group bg-white text-gray-900 font-semibold py-4 px-8 rounded-2xl flex items-center space-x-3 hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                disabled={isAnalyzing}
              >
                <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Fotoğraf Çek</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={handleUploadClick}
                className="group bg-transparent border-2 border-white/20 text-white font-semibold py-4 px-8 rounded-2xl flex items-center space-x-3 hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm"
                disabled={isAnalyzing}
              >
                <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Galeri'den Seç</span>
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
                disabled={isAnalyzing}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">%95</div>
                <div className="text-gray-400">Doğruluk Oranı</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">20 saniye</div>
                <div className="text-gray-400">Analiz Süresi</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">1000+</div>
                <div className="text-gray-400">Yiyecek Türü</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-16">
        {selectedImage ? (
          /* Analysis Results */
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Analiz Sonuçları</h2>
                    <p className="text-gray-600">AI tarafından analiz edildi</p>
                  </div>
                </div>
                <button 
                  onClick={resetAnalysis}
                  className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  disabled={isAnalyzing}
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-8">
                <div className="grid lg:grid-cols-2 gap-12">
                  {/* Image Section */}
                  <div className="space-y-6">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
                      {isAnalyzing ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-6"></div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">Analiz ediliyor...</h3>
                          <p className="text-gray-600">AI yemeğinizi inceliyor</p>
                        </div>
                      ) : (
                        <img 
                          src={selectedImage} 
                          alt="Yüklenen yemek" 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Results Section */}
                  <div className="space-y-8">
                    {/* Error State */}
                    {error && (
                      <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <X className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-red-900 mb-2">Bir hata oluştu</h3>
                            <p className="text-red-700">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Analysis Results */}
                    {analysisResult && !isAnalyzing && (
                      <div className="space-y-8">
                        {/* Nutrition Cards Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100">
                            <div className="flex items-center justify-between mb-3">
                              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Target className="w-4 h-4 text-orange-600" />
                              </div>
                            </div>
                            <p className="text-sm font-medium text-orange-600 uppercase tracking-wide mb-1">Kalori</p>
                            <p className="text-2xl font-bold text-orange-700">{analysisResult.output.totals.calories_kcal}</p>
                            <p className="text-sm text-orange-600">kcal</p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                            <div className="flex items-center justify-between mb-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Zap className="w-4 h-4 text-blue-600" />
                              </div>
                            </div>
                            <p className="text-sm font-medium text-blue-600 uppercase tracking-wide mb-1">Protein</p>
                            <p className="text-2xl font-bold text-blue-700">{analysisResult.output.totals.protein_g}</p>
                            <p className="text-sm text-blue-600">gram</p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                            <div className="flex items-center justify-between mb-3">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                              </div>
                            </div>
                            <p className="text-sm font-medium text-green-600 uppercase tracking-wide mb-1">Karbonhidrat</p>
                            <p className="text-2xl font-bold text-green-700">{analysisResult.output.totals.carbs_g}</p>
                            <p className="text-sm text-green-600">gram</p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-2xl border border-yellow-100">
                            <div className="flex items-center justify-between mb-3">
                              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <Award className="w-4 h-4 text-yellow-600" />
                              </div>
                            </div>
                            <p className="text-sm font-medium text-yellow-600 uppercase tracking-wide mb-1">Yağ</p>
                            <p className="text-2xl font-bold text-yellow-700">{analysisResult.output.totals.fat_g}</p>
                            <p className="text-sm text-yellow-600">gram</p>
                          </div>
                        </div>
                        
                        {/* Summary Card */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-100">
                          <div className="flex items-start space-x-4 mb-6">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Award className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-indigo-900 mb-3 text-xl">Değerlendirme</h3>
                              <p className="text-indigo-700 leading-relaxed mb-4">
                                {translateSummary(analysisResult.output.summary.quality || analysisResult.output.summary.balance || 'Analiz tamamlandı')}
                              </p>
                              
                              {(analysisResult.output.summary.overallTip || analysisResult.output.summary.general_tip) && (
                                <div className="bg-white/60 rounded-xl p-4 border border-indigo-100">
                                  <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-gray-700 leading-relaxed">
                                      {translateSummary(analysisResult.output.summary.overallTip || analysisResult.output.summary.general_tip || '')}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Food Items */}
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                          <h3 className="font-semibold text-gray-900 mb-6 flex items-center space-x-3 text-xl">
                            <TrendingUp className="w-6 h-6 text-gray-600" />
                            <span>Tespit Edilen Yiyecekler</span>
                          </h3>
                          
                          <div className="space-y-6">
                            {analysisResult.output.items.map((item, index) => (
                              <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                                <div className="flex items-start justify-between mb-4">
                                  <h4 className="font-semibold text-gray-900 text-lg">{translateFoodName(item.name)}</h4>
                                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    {item.portion_g}g
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                                  <div>
                                    <span className="text-gray-500 block">Kalori:</span>
                                    <span className="font-semibold text-gray-900">{item.calories_kcal} kcal</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 block">Protein:</span>
                                    <span className="font-semibold text-gray-900">{item.protein_g}g</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 block">Karbonhidrat:</span>
                                    <span className="font-semibold text-gray-900">{item.carbs_g}g</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 block">Yağ:</span>
                                    <span className="font-semibold text-gray-900">{item.fat_g}g</span>
                                  </div>
                                </div>
                                
                                {/* Diet Fit Tags */}
                                {item.dietFit && item.dietFit.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {item.dietFit.map((diet, dietIndex) => (
                                      <span 
                                        key={dietIndex}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getDietFitColor(diet)}`}
                                      >
                                        {translateDietFit(diet)}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Note and Tip */}
                                <div className="space-y-3">
                                  {item.note && (
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                      <p className="text-sm text-blue-700 leading-relaxed">{translateNote(item.note)}</p>
                                    </div>
                                  )}
                                  
                                  {item.tip && (
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                                      <div className="flex items-start space-x-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-emerald-700 leading-relaxed">{translateTip(item.tip)}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Welcome Screen */
          <div className="max-w-7xl mx-auto">
            {/* Features Section */}
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Neden Kalorify AI?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Gelişmiş yapay zeka teknolojisi ile beslenme analizini kolaylaştırıyoruz
              </p>
            </div>

            <div className="grid gap-8 lg:gap-12 mb-20 lg:grid-cols-3">
              <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-purple-200">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Anında Analiz</h3>
                <p className="text-gray-600 leading-relaxed">
                  Yemeğinizi fotoğraflayın, AI teknolojisi ile 20 saniyede besin değerlerini öğrenin.
                </p>
              </div>
              
              <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-purple-200">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Yüksek Doğruluk</h3>
                <p className="text-gray-600 leading-relaxed">
                  %95 doğruluk oranı ile 1000+ yiyecek türünü tanıyan gelişmiş makine öğrenimi.
                </p>
              </div>
              
              <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-purple-200">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Kişisel Öneriler</h3>
                <p className="text-gray-600 leading-relaxed">
                  Her analiz sonrası size özel beslenme tavsiyeleri ve sağlık ipuçları alın.
                </p>
              </div>
            </div>
            
            {/* How it works */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 shadow-lg border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Nasıl Çalışır?</h2>
              
              <div className="grid gap-8 lg:gap-12 lg:grid-cols-3">
                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-xl">Fotoğraf Çekin</h3>
                  <p className="text-gray-600 leading-relaxed">Yediğiniz yemeğin net bir fotoğrafını çekin veya galeriden seçin</p>
                </div>
                
                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-xl">AI Analizi</h3>
                  <p className="text-gray-600 leading-relaxed">Yapay zeka yemeğinizi analiz eder ve besin değerlerini hesaplar</p>
                </div>
                
                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-xl">Sonuçları Alın</h3>
                  <p className="text-gray-600 leading-relaxed">Detaylı besin değerleri, diyet uyumluluğu ve önerileri görün</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold">Kalorify AI</span>
          </div>
          <p className="text-gray-400 mb-4">© 2025 Kalorify AI. Tüm hakları saklıdır.</p>
          <p className="text-gray-500 text-sm">Yapay zeka destekli beslenme analizi platformu</p>
        </div>
      </footer>
    </div>
  );
}

export default App;