import React, { useState, useEffect, useRef, useMemo } from 'react';
import Typed from 'typed.js';

/* =========================================================
   CONFIGURAÇÕES PRINCIPAIS E PLAYLIST
   ========================================================= */
const PLAYLIST = [
  { titulo: 'LifeTime', src: '/musica/musica1.mp3' },
  { titulo: 'Oceano', src: '/musica/musica2.mp3' },
  { titulo: 'Poderia dizer te amo, mas...', src: '/musica/musica3.mp3' },
];

const DATA_INICIO = new Date('2025-10-26T00:00:00');
const FORMSPREE_URL = "https://formspree.io/f/xnpjelng"; 

const FOTOS = [
  { src: 'imagem/foto1.jpg', legenda: 'Eu', rotate: '-2deg' },
  { src: 'imagem/foto2.jpg', legenda: 'Te', rotate: '3deg' },
  { src: 'imagem/foto3.jpg', legenda: 'Amo', rotate: '-3deg' },
  { src: 'imagem/foto4.jpg', legenda: 'Meu lugar favorito! ❤️❤️', rotate: '2deg' },
];

/* CARTA PRINCIPAL */
const CARTA = [
  'Meu amor,^500\n\nComo diria Jane Austen em Orgulho e Preconceito: "Você me enfeitiçou de corpo e alma, e eu te amo."^500\n\nSe eu pudesse guardar tudo que sinto em uma única página, ela seria pequena demais.^400 Então escrevo devagar, para que cada linha te encontre do jeito que você merece: com calma e com verdade.^500\n\nObrigado por transformar dias comuns em lembranças eternas. Você é a minha coragem nos dias difíceis, o meu riso fácil, o meu lugar mais seguro no mundo.^500\n\nQue esta página exista para lembrar sempre: eu escolho você, todos os dias, em todas as vidas. ❤️'
];

const TIMELINE = [
  { data: 'Ago 2025', titulo: 'O Primeiro Olhar', desc: 'Te vi e soube que era especial, mesmo sendo embaraçoso.', emoji: '👀' },
  { data: 'Ago 2025', titulo: 'O Encontro', desc: 'A famosa desculpa de comprar roupas que mudou as nossas vidas.', emoji: '☕' },
  { data: 'Out 2025', titulo: 'O Sim', desc: 'O dia em que decidimos caminhar juntos. O dia mais feliz da minha vida.', emoji: '❤️' },
  { data: 'Dez 2025', titulo: '1º Natal', desc: 'A magia do Natal ficou perfeita e completa por ter você ao meu lado.', emoji: '🎄' },
  { data: 'Hoje', titulo: 'Aqui e Agora', desc: 'Escrevendo a nossa história, valorizando cada instante do nosso amor.', emoji: '🌹' },
];

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isExitingIntro, setIsExitingIntro] = useState(false);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showPlayerControls, setShowPlayerControls] = useState(false);

  const [time, setTime] = useState({ d: 0, h: '00', m: '00', s: '00' });
  const [hasAnswered, setHasAnswered] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [envState, setEnvState] = useState('idle');
  
  const [recados, setRecados] = useState([]);
  const [recadoTexto, setRecadoTexto] = useState('');
  const [enviando, setEnviando] = useState(false);

  const audioRef = useRef(null);
  const typedRef = useRef(null);
  const letterSectionRef = useRef(null);

  const petals = useMemo(() => {
    return [...Array(15)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 90}%`,
      duration: `${12 + Math.random() * 10}s`,
      delay: `${-Math.random() * 20}s`,
      icon: i % 2 === 0 ? '🌸' : '✨'
    }));
  }, []);

  const handleEntrar = () => {
    setIsExitingIntro(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Erro ao tocar áudio automático:", err));
    }
    setTimeout(() => {
      setHasEntered(true);
    }, 900);
  };

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    setRecados(JSON.parse(localStorage.getItem('amor-recados-v1')) || []);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date() - DATA_INICIO;
      setTime({
        d: Math.floor(diff / 86400000), h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'), s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!hasEntered) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && typedRef.current && !typedRef.current.initialized) {
        typedRef.current.initialized = true;
        new Typed(typedRef.current, { strings: CARTA, typeSpeed: 45, showCursor: false });
      }
    }, { threshold: 0.3 });
    if (letterSectionRef.current) observer.observe(letterSectionRef.current);
    return () => observer.disconnect();
  }, [hasEntered]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const proximaMusica = () => setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  const musicaAnterior = () => setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);

  const enviarRecado = async (e) => {
    e.preventDefault();
    if (!recadoTexto.trim()) return;
    setEnviando(true);
    try {
      if (!FORMSPREE_URL.includes("SEU_ID")) {
        await fetch(FORMSPREE_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mensagem: recadoTexto }) });
      }
      const novoRecado = { msg: recadoTexto, data: new Date().toLocaleDateString('pt-BR') };
      const novaLista = [novoRecado, ...recados];
      setRecados(novaLista); localStorage.setItem('amor-recados-v1', JSON.stringify(novaLista));
      setRecadoTexto('');
    } catch (err) {} finally { setEnviando(false); }
  };

  // NOVA FUNÇÃO: Apagar Recado Específico
  const apagarRecado = (indexParaApagar) => {
    const novaLista = recados.filter((_, index) => index !== indexParaApagar);
    setRecados(novaLista);
    localStorage.setItem('amor-recados-v1', JSON.stringify(novaLista));
  };

  const fugir = (e) => {
    const btn = e.target;
    const container = btn.closest('.area-climax');
    if (!container) return;
    const w = btn.offsetWidth; const h = btn.offsetHeight;
    const maxX = container.offsetWidth - w - 20; const maxY = container.offsetHeight - h - 20;
    const nx = Math.max(10, Math.random() * maxX); const ny = Math.max(10, Math.random() * maxY);
    btn.style.position = 'absolute'; btn.style.left = `${nx}px`; btn.style.top = `${ny}px`; btn.style.zIndex = '50';
  };

  const handleEnvelopeClick = (e) => {
    e.stopPropagation();
    if (envState === 'idle') {
      setEnvState('open');
    } else if (envState === 'open') {
      setEnvState('closing');
      setTimeout(() => setEnvState('idle'), 1700);
    }
  };

  const closeEnvelopeInstantly = () => {
    setEnvState('idle');
    setIsModalOpen(false);
  };

  return (
    <div className="w-full min-h-screen notebook-bg relative overflow-x-hidden flex flex-col items-center pb-24">
      
      {petals.map((petal) => (
        <div key={petal.id} className="petal text-[#8b0000]/60 text-xl sm:text-2xl"
             style={{ left: petal.left, animationDuration: petal.duration, animationDelay: petal.delay }}>
          {petal.icon}
        </div>
      ))}

      {/* TELA DE INTRODUÇÃO */}
      {!hasEntered && (
        <div 
          className={`fixed inset-0 z-[200] flex items-center justify-center bg-[#1a0a0a]/90 backdrop-blur-md p-6 text-center transition-all duration-1000 ease-in-out transform ${
            isExitingIntro ? '-translate-y-full opacity-0 scale-95 pointer-events-none' : 'translate-y-0 opacity-100 scale-100'
          }`}
        >
          <div className="fantasy-border bg-[#fff9f0] p-8 sm:p-12 rounded-2xl shadow-2xl max-w-[480px] w-full flex flex-col items-center relative overflow-hidden">
            <div className="washi-tape !-top-3 !left-1/2 !-translate-x-1/2 !w-24 !h-6 pointer-events-none"></div>
            
            <span className="text-[#8b0000] text-4xl mb-3 animate-bounce">✨</span>
            
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold italic text-[#4a1515] mb-2">
              Diário de Memórias
            </h1>
            
            <p className="font-handwriting text-2xl text-[#8b0000] mb-2">
              escrito com amor, só para você
            </p>

            <p className="font-playfair italic text-[0.7rem] text-[#d4a017] uppercase tracking-widest font-bold mb-4">
              ✨ Sem Orgulho, Sem Preconceito e Com Todo o Meu Amor ✨
            </p>

            <div className="w-full h-[1px] bg-[#d4a017]/30 my-2"></div>

            <p className="font-nunito italic text-xs text-[#4a1515]/70 my-4 leading-relaxed">
              Existem histórias que merecem ser guardadas para sempre. Toque no selo abaixo para abrir as nossas páginas...
            </p>

            <button 
              type="button"
              onClick={handleEntrar}
              className="mt-4 px-8 py-4 bg-gradient-to-r from-[#8b0000] to-[#5c0f0f] text-[#f7f1e3] font-fantasy font-bold text-sm tracking-widest rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-[#d4a017] flex items-center gap-3"
            >
              <span className="text-xl">📜</span>
              <span>Abrir Nosso Mundo</span>
              <span className="text-xl">✨</span>
            </button>
          </div>
        </div>
      )}

      {/* AUDIO ELEMENT */}
      <audio ref={audioRef} src={PLAYLIST[currentTrackIndex]?.src} onEnded={proximaMusica} preload="auto" />

      {/* MINI PLAYER DE MÚSICA FLUTUANTE */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex flex-col items-end">
        <div className="bg-white/80 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-[#d4a017]/40 flex flex-col items-center gap-2 max-w-[220px]">
          <div className="flex items-center gap-3 w-full cursor-pointer" onClick={() => setShowPlayerControls(!showPlayerControls)}>
            <div className={`w-9 h-9 shrink-0 rounded-full bg-[#111] border-[2px] border-[#222] shadow-md flex items-center justify-center ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}`}>
              <div className="w-3 h-3 rounded-full bg-[#8b0000] border border-[#d4a017] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-black"></div>
              </div>
            </div>
            
            <div className="flex flex-col overflow-hidden text-left flex-1">
              <span className="text-[0.65rem] font-bold text-[#4a1515] truncate font-fantasy">{PLAYLIST[currentTrackIndex]?.titulo || 'Música'}</span>
              <span className="text-[0.55rem] text-[#d4a017] uppercase tracking-wider font-bold">{isPlaying ? '▶ Tocando' : '⏸ Pausado'}</span>
            </div>

            <button type="button" onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="text-[#8b0000] text-lg font-bold p-1">
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>

          {showPlayerControls && (
            <div className="w-full pt-2 border-t border-[#d4a017]/20 flex flex-col items-center gap-2">
              <div className="flex items-center justify-center gap-4 w-full">
                <button type="button" onClick={musicaAnterior} className="text-[#8b0000] hover:text-[#d4a017] text-base font-bold transition-colors">⏮</button>
                <button type="button" onClick={togglePlay} className="w-8 h-8 rounded-full bg-[#8b0000] text-white flex items-center justify-center text-xs shadow-md">
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button type="button" onClick={proximaMusica} className="text-[#8b0000] hover:text-[#d4a017] text-base font-bold transition-colors">⏭</button>
              </div>

              <div className="flex items-center gap-2 w-full px-1">
                <span className="text-[0.6rem] text-[#8b0000]">🔈</span>
                <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full h-1 bg-[#d4a017]/30 rounded-lg appearance-none cursor-pointer accent-[#8b0000]" />
                <span className="text-[0.6rem] text-[#8b0000]">🔊</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="w-full max-w-[600px] flex flex-col gap-16 sm:gap-24 px-6 pt-16 z-10">
        
        <section className="flex flex-col items-center text-center mt-8">
          <div className="text-[#8b0000] text-3xl mb-4 animate-bounce">✨</div>
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold italic text-[#4a1515] leading-tight mb-2 drop-shadow-sm">Nossa História</h1>
          <p className="font-handwriting text-2xl text-[#8b0000] mb-8">assim que somos desde <span className="text-[#d4a017] font-bold">26.10.2025</span></p>
          
          <div className="fantasy-border bg-[#fff9f0]/90 backdrop-blur-md p-6 rounded-lg shadow-lg w-full">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 divide-x divide-[#d4a017]/30">
              {[{ n: time.d, l: 'Dias' }, { n: time.h, l: 'Horas' }, { n: time.m, l: 'Min' }, { n: time.s, l: 'Seg' }].map((t, i) => (
                <div key={i} className="flex flex-col items-center justify-center pl-2">
                  <span className="font-playfair text-2xl sm:text-4xl font-bold text-[#8b0000] drop-shadow-sm">{t.n}</span>
                  <span className="text-[0.6rem] sm:text-xs font-fantasy font-bold tracking-widest text-[#d4a017] uppercase mt-1">{t.l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full flex flex-col relative">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] flex-1 bg-[#d4a017]/40"></div>
            <h2 className="font-fantasy text-lg font-bold text-[#d4a017] uppercase tracking-widest text-center">Memórias</h2>
            <div className="h-[1px] flex-1 bg-[#d4a017]/40"></div>
          </div>
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-6 px-6 no-scrollbar">
            {FOTOS.map((foto, i) => (
              <div key={i} className="snap-center shrink-0 polaroid relative" style={{ transform: `rotate(${foto.rotate})` }}>
                <div className="washi-tape"></div>
                {foto.src ? <img src={foto.src} className="w-full h-[250px] object-cover sepia-[0.2] rounded-sm" /> : <div className="w-full h-[250px] bg-[#e8dcc5] rounded-sm"></div>}
                <p className="font-handwriting text-2xl mt-4 text-center text-[#4a1515] font-bold">{foto.legenda}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[0.6rem] font-fantasy text-[#8b0000]/50 uppercase tracking-widest -mt-4 animate-pulse">Deslize para ver mais ➔</p>
        </section>

        <section ref={letterSectionRef} className="w-full flex flex-col items-center pt-8">
          <div className="flex items-center gap-4 mb-8 w-full">
            <div className="h-[1px] flex-1 bg-[#d4a017]/40"></div>
            <h2 className="font-fantasy text-lg font-bold text-[#d4a017] uppercase tracking-widest text-center">Minha Declaração</h2>
            <div className="h-[1px] flex-1 bg-[#d4a017]/40"></div>
          </div>
          <div className="w-full magic-letter-paper px-8 pb-10 pt-[32px] relative overflow-hidden">
            <div className="font-handwriting text-[1.4rem] sm:text-[1.6rem] text-[#2a0505] font-bold" style={{ lineHeight: '32px', marginTop: '-4px' }}>
              <span ref={typedRef}></span>
            </div>
          </div>
        </section>

        <section className="w-full flex flex-col pt-8">
          <div className="flex items-center gap-4 mb-10 w-full">
            <div className="h-[1px] flex-1 bg-[#d4a017]/40"></div>
            <h2 className="font-fantasy text-lg font-bold text-[#d4a017] uppercase tracking-widest text-center">Nossa Jornada</h2>
            <div className="h-[1px] flex-1 bg-[#d4a017]/40"></div>
          </div>
          <div className="relative border-l-2 border-dashed border-[#d4a017] ml-8 flex-1 flex flex-col justify-between gap-8 py-4">
            {TIMELINE.map((item, i) => (
              <div key={i} className="relative pl-8">
                <div className="absolute -left-[17px] top-0 w-8 h-8 bg-gradient-to-br from-[#e5b83b] to-[#c59a22] rounded-full border-2 border-[#fff9f0] shadow-md flex items-center justify-center text-sm z-10">{item.emoji}</div>
                <div className="text-xs font-fantasy font-bold tracking-widest text-[#8b0000] mb-1 bg-[#fdfaf6] inline-block pr-2">{item.data}</div>
                <div className="font-playfair text-xl font-bold text-[#4a1515] leading-tight">{item.titulo}</div>
                <div className="font-nunito text-sm text-[#4a1515]/80 leading-snug mt-2 italic bg-white/40 p-3 rounded-lg border border-[#d4a017]/20">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full flex flex-col pt-8">
          <div className="flex items-center gap-4 mb-8 w-full">
            <div className="h-[1px] flex-1 bg-[#d4a017]/40"></div>
            <h2 className="font-fantasy text-lg font-bold text-[#d4a017] uppercase tracking-widest text-center">Nossa Promessa</h2>
            <div className="h-[1px] flex-1 bg-[#d4a017]/40"></div>
          </div>
          <div className="bg-[#fff9f0] fantasy-border p-8 rounded-lg shadow-md w-full relative overflow-hidden">
            <div className="absolute top-2 left-4 text-[#d4a017]/20 text-6xl font-fantasy font-bold">"</div>
            <div className="absolute -bottom-6 right-4 text-[#d4a017]/20 text-6xl font-fantasy font-bold">"</div>
            <p className="font-playfair text-[1.1rem] sm:text-[1.2rem] text-[#4a1515] italic leading-relaxed text-center px-2 sm:px-6 relative z-10">
              Eu me comprometo a amá-la seriamente, em todas suas formas. Agora e para sempre. Prometo que nunca vou esquecer que esse é um amor para toda a vida. E sempre sabendo na parte mais profunda da minha alma que não importa quais desafios venham nos separar, sempre encontraremos o caminho de volta para o outro.
            </p>
            <p className="font-fantasy text-xs text-[#8b0000] font-bold mt-8 text-center uppercase tracking-widest relative z-10">
              — Para Sempre
            </p>
          </div>
        </section>

        <section className="w-full flex flex-col items-center pt-12 text-center">
          <div className="flex items-center gap-4 mb-8 w-full">
            <div className="h-[1px] flex-1 bg-[#d4a017]/40"></div>
            <h2 className="font-fantasy text-lg font-bold text-[#d4a017] uppercase tracking-widest text-center">Segredo</h2>
            <div className="h-[1px] flex-1 bg-[#d4a017]/40"></div>
          </div>
          <h2 className="font-handwriting text-4xl text-[#8b0000] mb-8">uma surpresa escondida...</h2>
          <div className="flex flex-col items-center animate-pulse cursor-pointer hover:scale-105 transition-transform" onClick={() => { setEnvState('idle'); setIsModalOpen(true); }}>
            <div className="w-20 h-20 bg-gradient-to-br from-[#8b0000] to-[#4a0d0d] rounded-full border-[3px] border-[#d4a017] shadow-[0_0_20px_rgba(212,160,23,0.5)] flex items-center justify-center text-[#d4a017] text-3xl mb-3">👑</div>
            <span className="font-fantasy text-xs text-[#8b0000] font-bold uppercase tracking-widest">Tocar Selo</span>
          </div>
        </section>

        <section className="w-full flex flex-col pt-8">
          <div className="flex items-center gap-4 mb-8 w-full">
            <div className="h-[1px] flex-1 bg-[#d4a017]/40"></div>
            <h2 className="font-fantasy text-lg font-bold text-[#d4a017] uppercase tracking-widest text-center">Deixe sua Marca</h2>
            <div className="h-[1px] flex-1 bg-[#d4a017]/40"></div>
          </div>
          <h2 className="font-handwriting text-3xl text-[#8b0000] mb-6 text-center">um cartão postal para você</h2>
          
          <form onSubmit={enviarRecado} className="w-full bg-[#fff9f0] fantasy-border p-6 rounded-lg shadow-md relative mb-10">
            <div className="washi-tape !-top-4 !left-10 !w-16 !h-5 pointer-events-none"></div>
            <textarea value={recadoTexto} onChange={(e) => setRecadoTexto(e.target.value)} placeholder="Escreva sua magia aqui..." className="w-full h-[100px] bg-transparent outline-none resize-none font-handwriting text-2xl text-[#4a1515] placeholder:text-[#d4a017]/50" required />
            <div className="w-full flex justify-end mt-4">
              <button type="submit" disabled={enviando} className="px-6 py-2 bg-gradient-to-r from-[#8b0000] to-[#5c0f0f] text-white font-fantasy text-xs font-bold tracking-widest rounded-md shadow-md hover:scale-105 transition-transform">
                {enviando ? 'Enviando...' : 'Assinar Diário'}
              </button>
            </div>
          </form>

          {/* LISTA DE RECADOS (AGORA COM BOTÃO DE APAGAR) */}
          <div className="flex flex-col gap-4 w-full">
            {recados.map((r, i) => (
              <div key={i} className="border-l-4 border-[#d4a017] bg-white/50 p-4 rounded-r-lg shadow-sm relative group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[0.6rem] uppercase font-fantasy tracking-widest text-[#8b0000] font-bold">Recado Nº {recados.length - i}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[0.6rem] uppercase font-fantasy tracking-widest text-[#d4a017]">{r.data}</span>
                    {/* BOTAO DE APAGAR AQUI */}
                    <button 
                      onClick={() => apagarRecado(i)} 
                      className="text-[#8b0000]/30 hover:text-[#8b0000] transition-colors text-xs ml-1"
                      title="Apagar este recado"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="font-handwriting text-2xl text-[#4a1515] leading-tight font-bold">{r.msg}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full flex flex-col items-center justify-center pt-8 pb-16 text-center area-climax relative min-h-[300px]">
          <div className="flex items-center gap-4 mb-10 w-full relative z-10">
            <div className="h-[1px] flex-1 bg-[#d4a017]/40"></div>
            <h2 className="font-fantasy text-lg font-bold text-[#d4a017] uppercase tracking-widest text-center">O Clímax</h2>
            <div className="h-[1px] flex-1 bg-[#d4a017]/40"></div>
          </div>
          <h2 className="font-handwriting text-[4rem] sm:text-[5rem] text-[#8b0000] mb-12 leading-none drop-shadow-md relative z-10 pointer-events-none">
            {!hasAnswered ? 'Você me ama?' : 'Te amo mais! ❤️'}
          </h2>
          {!hasAnswered ? (
            <div className="flex items-center justify-center gap-6 h-[50px] w-full max-w-[300px] relative z-20">
              <button onClick={() => setHasAnswered(true)} className="w-[120px] h-[50px] bg-[#8b0000] text-[#f7f1e3] font-fantasy font-bold tracking-widest rounded-lg shadow-lg text-lg hover:scale-110 transition-transform border border-[#d4a017]">SIM</button>
              <div className="w-[120px] h-[50px]">
                <button onMouseEnter={fugir} onTouchStart={fugir} className="w-[120px] h-[50px] bg-[#fdfaf6] border-2 border-[#8b0000]/30 text-[#8b0000]/60 font-fantasy font-bold tracking-widest rounded-lg text-lg flex items-center justify-center shadow-sm transition-all duration-200">NÃO</button>
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center mt-8 relative z-10">
               <span className="font-fantasy text-lg text-[#d4a017] font-bold tracking-widest uppercase border-b-2 border-[#d4a017]/30 pb-2">E sempre amarei.</span>
            </div>
          )}
          <div className="text-[#8b0000] text-2xl mt-16 animate-bounce relative z-10">🌹</div>
        </section>

      </main>

      {/* MODAL DO ENVELOPE 3D */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={closeEnvelopeInstantly}>
          <div className={`envelope-wrapper ${envState === 'open' ? 'env-open' : ''} ${envState === 'closing' ? 'env-closing' : ''}`} onClick={handleEnvelopeClick}>
            <div className="envelope-interior"></div>
            <div className="envelope-left"></div>
            <div className="envelope-right"></div>
            <div className="envelope-body"></div>
            
            <div className="envelope-flap">
              <div className="flap-paper"></div>
              <div className="wax-seal font-fantasy">👑</div>
            </div>
            
            <div className="envelope-letter">
              <div className="flex items-center justify-center gap-2 mb-2 text-[#8b0000] shrink-0 mt-2">
                <span className="text-[#d4a017] text-sm">✨</span>
                <span className="text-3xl drop-shadow-md animate-pulse">❤️</span>
                <span className="text-[#d4a017] text-sm">✨</span>
              </div>
              
              <p className="font-fantasy text-[0.7rem] text-[#d4a017] uppercase tracking-widest font-bold mb-4 shrink-0">Nosso Segredo</p>

              <p className="font-handwriting text-[1.6rem] sm:text-[1.8rem] font-bold text-[#4a1515] text-center px-2 sm:px-4" style={{ lineHeight: '32px' }}>
                "Sempre encontraremos o caminho de volta um para o outro."
              </p>
            </div>
            
            {envState === 'idle' && (
              <p className="absolute -bottom-10 w-full text-center text-[#d4a017] font-fantasy text-xs tracking-widest animate-pulse">Toque para desvendar</p>
            )}
          </div>
          <button onClick={closeEnvelopeInstantly} className="absolute top-6 right-6 text-[#d4a017] hover:text-white text-4xl font-bold transition-colors">&times;</button>
        </div>
      )}
    </div>
  );
}