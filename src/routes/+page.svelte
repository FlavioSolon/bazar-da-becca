<script>
	import { fade, fly, scale } from 'svelte/transition';
	import tangerineFlower from '$lib/assets/tangerine.png';
	import woodTexture from '$lib/assets/wood-texture.png';
	import { onMount } from 'svelte';

	const books = [
		{
			id: 1,
			title: 'A Menina que Roubava Livros',
			author: 'Markus Zusak',
			price: 'R$ 35,00',
			category: 'Literatura Estrangeira',
			image: 'https://m.media-amazon.com/images/I/71rpa1-kyvL._SL1500_.jpg',
			color: 'bg-red-800'
		},
		{
			id: 2,
			title: 'O Pequeno Príncipe',
			author: 'Saint-Exupéry',
			price: 'R$ 20,00',
			category: 'Infantil',
			image: 'https://m.media-amazon.com/images/I/71On2k+rXhL._SL1500_.jpg',
			color: 'bg-yellow-600'
		},
		{
			id: 3,
			title: '1984',
			author: 'George Orwell',
			price: 'R$ 30,00',
			category: 'Ficção',
			image: 'https://m.media-amazon.com/images/I/61t0bwt1sXL._SL1200_.jpg',
			color: 'bg-gray-800'
		},
		{
			id: 4,
			title: 'Dom Quixote',
			author: 'Cervantes',
			price: 'R$ 45,00',
			category: 'Clássico',
			image: 'https://m.media-amazon.com/images/I/71y6-a-5O3L._AC_UF1000,1000_QL80_.jpg',
			color: 'bg-amber-900'
		},
		{
			id: 5,
			title: 'O Hobbit',
			author: 'J.R.R. Tolkien',
			price: 'R$ 40,00',
			category: 'Fantasia',
			image: 'https://m.media-amazon.com/images/I/91M9xPIf10L._SL1500_.jpg',
			color: 'bg-green-800'
		},
		{
			id: 6,
			title: 'Orgulho e Preconceito',
			author: 'Jane Austen',
			price: 'R$ 25,00',
			category: 'Romance',
			image: 'https://m.media-amazon.com/images/I/71Q1tYupKjL._SL1270_.jpg',
			color: 'bg-rose-900'
		}
	];

	let hasEntered = false;
	let doorOpen = false;

	onMount(() => {
		setTimeout(() => {
			hasEntered = true;
			doorOpen = true;
		}, 500);
	});

	// Shelf background style
	const shelfStyle = `background-image: url('${woodTexture}'); box-shadow: inset 0 10px 30px rgba(0,0,0,0.5);`;
</script>

<div
	class="bg-aged-paper relative min-h-screen overflow-x-hidden selection:bg-[var(--color-moss-green)] selection:text-[var(--color-paper-aged)]"
>
	<!-- Entrance Animation (Overlay) -->
	{#if !doorOpen}
		<div
			class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f0a] transition-opacity duration-1000"
			out:fade={{ duration: 1500 }}
		>
			<div class="text-center">
				<h1 class="font-display mb-4 text-4xl tracking-widest text-[#d4b483] uppercase">
					Bazar da Becca
				</h1>
				<p class="animate-pulse text-[#8b5a2b]">Entrando na biblioteca...</p>
			</div>
		</div>
	{/if}

	<!-- Decorative Flowers (Fixed Parallax) -->
	<div
		class="animate-sway pointer-events-none fixed top-[-50px] left-[-50px] z-20 h-80 w-80 opacity-90"
	>
		<img src={tangerineFlower} alt="" class="h-full w-full object-contain drop-shadow-xl filter" />
	</div>
	<div
		class="animate-sway-delayed pointer-events-none fixed right-[-50px] bottom-[-50px] z-20 h-96 w-96 opacity-80"
	>
		<img
			src={tangerineFlower}
			alt=""
			class="h-full w-full rotate-180 transform object-contain drop-shadow-xl filter"
		/>
	</div>

	<!-- Main Content -->
	<div
		class="relative z-10 transform pt-24 pb-20 transition-all duration-1000 {doorOpen
			? 'scale-100 opacity-100'
			: 'scale-95 opacity-0'}"
	>
		<header class="relative mb-16 text-center">
			<h1
				class="font-display mb-4 text-6xl text-[var(--color-deep-forest)] drop-shadow-sm md:text-8xl"
			>
				Bazar da Becca
			</h1>
			<div class="mx-auto mb-6 h-1 w-24 rounded-full bg-[var(--color-camo-brown)]"></div>
			<p
				class="font-display mx-auto max-w-3xl px-4 text-2xl leading-relaxed text-[var(--color-camo-brown)] italic md:text-3xl"
			>
				"Uma história para cada alma, um propósito para cada livro."
			</p>
		</header>

		<!-- Bookshelf Container -->
		<div class="container mx-auto max-w-5xl px-4 md:px-12">
			<!-- Shelf 1 -->
			<div class="relative mb-20">
				<!-- Wood Shelf Surface -->
				<div
					class="absolute right-[-20px] bottom-[-20px] left-[-20px] z-0 h-8 rounded-sm bg-repeat"
					style={shelfStyle}
				></div>
				<!-- Shelf Shadow -->
				<div class="absolute right-0 bottom-[-35px] left-0 z-[-1] h-10 bg-black/20 blur-xl"></div>

				<div class="grid grid-cols-1 items-end gap-8 px-4 pb-2 md:grid-cols-3 md:gap-12 md:px-8">
					{#each books.slice(0, 3) as book, i (book.id)}
						<div class="group perspective-1000 relative cursor-pointer" role="button" tabindex="0">
							<!-- Book -->
							<div
								class="relative aspect-[2/3] w-full origin-bottom transform overflow-hidden rounded-r
                                bg-[#eaddcf] shadow-2xl transition-all duration-500
                                md:rounded-r-lg md:group-hover:z-50 md:group-hover:translate-y-[-20px] md:group-hover:scale-110 md:group-hover:rotate-x-12"
							>
								<img src={book.image} alt={book.title} class="h-full w-full object-cover" />

								<!-- Spine Shadow overlay for depth -->
								<div
									class="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/40 to-transparent"
								></div>
								<!-- Lighting Reflection -->
								<div
									class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
								></div>
							</div>

							<!-- "Card" Info on Hover (Floating above) -->
							<div
								class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-4 w-48 -translate-x-1/2 translate-y-4 transform rounded-xl border border-[var(--color-sunset-orange)]/20 bg-white/95 p-4 text-center opacity-0 shadow-xl backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
							>
								<h3
									class="font-display mb-1 text-lg leading-tight font-bold text-[var(--color-deep-forest)]"
								>
									{book.title}
								</h3>
								<p class="mb-2 text-xs tracking-wider text-[var(--color-camo-brown)] uppercase">
									{book.category}
								</p>
								<p class="mb-2 font-bold text-[var(--color-sunset-orange)]">{book.price}</p>
								<span class="text-xs text-gray-400">Clique para ver</span>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Shelf 2 -->
			<div class="relative mb-20">
				<div
					class="absolute right-[-20px] bottom-[-20px] left-[-20px] z-0 h-8 rounded-sm bg-repeat"
					style={shelfStyle}
				></div>
				<div class="absolute right-0 bottom-[-35px] left-0 z-[-1] h-10 bg-black/20 blur-xl"></div>

				<div class="grid grid-cols-1 items-end gap-8 px-4 pb-2 md:grid-cols-3 md:gap-12 md:px-8">
					{#each books.slice(3, 6) as book, i (book.id)}
						<div class="group perspective-1000 relative cursor-pointer" role="button" tabindex="0">
							<div
								class="relative aspect-[2/3] w-full origin-bottom transform overflow-hidden rounded-r
                                  bg-[#eaddcf] shadow-2xl transition-all duration-500
                                  md:rounded-r-lg md:group-hover:z-50 md:group-hover:translate-y-[-20px] md:group-hover:scale-110 md:group-hover:rotate-x-12"
							>
								<img src={book.image} alt={book.title} class="h-full w-full object-cover" />
								<div
									class="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/40 to-transparent"
								></div>
								<div
									class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
								></div>
							</div>
							<div
								class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-4 w-48 -translate-x-1/2 translate-y-4 transform rounded-xl border border-[var(--color-sunset-orange)]/20 bg-white/95 p-4 text-center opacity-0 shadow-xl backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
							>
								<h3
									class="font-display mb-1 text-lg leading-tight font-bold text-[var(--color-deep-forest)]"
								>
									{book.title}
								</h3>
								<p class="mb-2 text-xs tracking-wider text-[var(--color-camo-brown)] uppercase">
									{book.category}
								</p>
								<p class="mb-2 font-bold text-[var(--color-sunset-orange)]">{book.price}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Shelf 3 (CTA) -->
			<div class="relative mb-12 flex justify-center pb-2">
				<div
					class="absolute right-[-20px] bottom-[-20px] left-[-20px] z-0 h-8 rounded-sm bg-repeat"
					style={shelfStyle}
				></div>
				<div
					class="transform cursor-pointer rounded-lg border-2 border-[var(--color-deep-forest)]/10 bg-white/80 p-6 text-center shadow-lg backdrop-blur-sm transition-transform hover:scale-105"
				>
					<p class="font-display text-xl text-[var(--color-deep-forest)]">
						Veja todos os livros disponíveis
					</p>
					<p class="mt-2 text-lg font-bold text-[var(--color-sunset-orange)]">
						Ir para a coleção completa &rarr;
					</p>
				</div>
			</div>
		</div>

		<footer class="mt-20 text-center text-sm text-[var(--color-camo-brown)]/60">
			<p>Bazar da Becca &copy; 2025. Construindo conhecimento.</p>
		</footer>
	</div>
</div>

<style>
	.perspective-1000 {
		perspective: 1000px;
	}

	@keyframes sway {
		0%,
		100% {
			transform: rotate(-5deg) translateY(0);
		}
		50% {
			transform: rotate(5deg) translateY(-10px);
		}
	}

	@keyframes sway-delayed {
		0%,
		100% {
			transform: rotate(185deg) translateY(0);
		}
		50% {
			transform: rotate(175deg) translateY(-15px);
		}
	}

	.animate-sway {
		animation: sway 8s ease-in-out infinite;
	}

	.animate-sway-delayed {
		animation: sway-delayed 10s ease-in-out infinite;
	}
</style>
