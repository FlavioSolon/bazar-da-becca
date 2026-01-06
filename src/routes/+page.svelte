<script>
	import { fade, fly } from 'svelte/transition';
	import tangerineFlower from '$lib/assets/tangerine.png';
	import woodTexture from '$lib/assets/wood-texture.png';
	import { onMount } from 'svelte';

	// Expanded Mock Data
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
		},
		// Duplicates for pagination demo
		{
			id: 7,
			title: 'O Senhor dos Anéis',
			author: 'J.R.R. Tolkien',
			price: 'R$ 60,00',
			category: 'Fantasia',
			image: 'https://m.media-amazon.com/images/I/71ZLavBjpRL._AC_UF1000,1000_QL80_.jpg',
			color: 'bg-orange-800'
		},
		{
			id: 8,
			title: 'Harry Potter',
			author: 'J.K. Rowling',
			price: 'R$ 45,00',
			category: 'Infantil',
			image: 'https://m.media-amazon.com/images/I/81ibfYk4qXL._SL1500_.jpg',
			color: 'bg-purple-800'
		},
		{
			id: 9,
			title: 'Crepúsculo',
			author: 'Stephenie Meyer',
			price: 'R$ 25,00',
			category: 'Romance',
			image: 'https://m.media-amazon.com/images/I/615ZIxEDozL._AC_UF1000,1000_QL80_.jpg',
			color: 'bg-gray-900'
		},
		{
			id: 10,
			title: 'A Revolução dos Bichos',
			author: 'George Orwell',
			price: 'R$ 25,00',
			category: 'Ficção',
			image: 'https://m.media-amazon.com/images/I/91sJ39j8vTL._AC_UF1000,1000_QL80_.jpg',
			color: 'bg-red-700'
		},
		{
			id: 11,
			title: 'O Alquimista',
			author: 'Paulo Coelho',
			price: 'R$ 30,00',
			category: 'Brasileira',
			image: 'https://m.media-amazon.com/images/I/71aFt4+OTOL._AC_UF1000,1000_QL80_.jpg',
			color: 'bg-yellow-700'
		},
		{
			id: 12,
			title: 'Capitães da Areia',
			author: 'Jorge Amado',
			price: 'R$ 35,00',
			category: 'Brasileira',
			image: 'https://m.media-amazon.com/images/I/813+04-sMGL._AC_UF1000,1000_QL80_.jpg',
			color: 'bg-blue-800'
		}
	];

	let hasEntered = false;
	let doorOpen = false;

	// Pagination State
	let currentPage = 1;
	const itemsPerPage = 6;

	$: totalPages = Math.ceil(books.length / itemsPerPage);
	$: paginatedBooks = books.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	function goToPage(p) {
		if (p >= 1 && p <= totalPages) {
			currentPage = p;
			document.getElementById('bookshelf')?.scrollIntoView({ behavior: 'smooth' });
		}
	}

	onMount(() => {
		setTimeout(() => {
			hasEntered = true;
			doorOpen = true;
		}, 500);
	});

	const shelfStyle = `background-image: url('${woodTexture}'); box-shadow: inset 0 2px 5px rgba(0,0,0,0.4);`;
	const whatsappNumber = '5592981496477';
</script>

<div
	class="bg-aged-paper relative min-h-screen overflow-x-hidden selection:bg-[var(--color-moss-green)] selection:text-[var(--color-paper-aged)]"
>
	<!-- Entrance Animation -->
	{#if !doorOpen}
		<div
			class="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-[#1a0f0a] transition-opacity duration-1000"
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

	<!-- Decorative Flowers (Moved to z-0 to avoid overlapping content) -->
	<div
		class="animate-sway pointer-events-none fixed top-[-50px] left-[-50px] z-0 h-64 w-64 opacity-60 md:h-80 md:w-80 md:opacity-90"
	>
		<img src={tangerineFlower} alt="" class="h-full w-full object-contain drop-shadow-xl filter" />
	</div>
	<div
		class="animate-sway-delayed pointer-events-none fixed right-[-50px] bottom-[-50px] z-0 h-64 w-64 opacity-50 md:h-96 md:w-96 md:opacity-80"
	>
		<img
			src={tangerineFlower}
			alt=""
			class="h-full w-full rotate-180 transform object-contain drop-shadow-xl filter"
		/>
	</div>

	<!-- Main Content -->
	<div
		class="relative z-10 transform pt-16 pb-20 transition-all duration-1000 md:pt-24 {doorOpen
			? 'scale-100 opacity-100'
			: 'scale-95 opacity-0'}"
	>
		<header class="relative mb-16 px-4 text-center">
			<h1
				class="font-display mb-4 text-5xl text-[var(--color-deep-forest)] drop-shadow-sm md:text-8xl"
			>
				Bazar da Becca
			</h1>
			<div class="mx-auto mb-6 h-1 w-16 rounded-full bg-[var(--color-camo-brown)] md:w-24"></div>
			<p
				class="font-display mx-auto max-w-3xl text-xl leading-relaxed text-[var(--color-camo-brown)] italic md:text-3xl"
			>
				"Uma história para cada alma, um propósito para cada livro."
			</p>
		</header>

		<!-- Bookshelf Container -->
		<div id="bookshelf" class="container mx-auto max-w-6xl px-4">
			<div class="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-20 lg:grid-cols-3">
				{#each paginatedBooks as book, i (book.id)}
					<div class="group perspective-1000 relative flex flex-col items-center">
						<!-- Book + Shelf Wrapper -->
						<div class="relative w-full max-w-[280px] md:max-w-full">
							<!-- Clickable Book Area -->
							<div
								class="relative z-20 aspect-[2/3] w-full origin-bottom transform cursor-pointer
                                        overflow-hidden rounded-r bg-[#eaddcf] shadow-2xl
                                        transition-all duration-500 md:rounded-r-lg md:group-hover:z-50 md:group-hover:translate-y-[-15px] md:group-hover:scale-105 md:group-hover:rotate-x-12"
							>
								<img src={book.image} alt={book.title} class="h-full w-full object-cover" />

								<!-- Spine & Lighting -->
								<div
									class="absolute top-0 bottom-0 left-0 w-2 bg-gradient-to-r from-black/40 to-transparent md:w-3"
								></div>
								<div
									class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
								></div>

								<!-- Mobile Only: Price Badge on cover (optional) or just below -->
							</div>

							<!-- Individual Shelf (Visible on Mobile & Desktop) -->
							<div
								class="absolute right-[-15px] bottom-[-15px] left-[-15px] z-10 h-6 rounded-sm bg-repeat shadow-lg md:h-8"
								style={shelfStyle}
							></div>
							<!-- Shelf Shadow -->
							<div class="absolute right-0 bottom-[-25px] left-0 z-0 h-8 bg-black/20 blur-lg"></div>
						</div>

						<!-- Info: Mobile (Static Below) vs Desktop (Hover Card) -->
						<div
							class="relative z-30 mt-6 w-full max-w-[280px] text-center md:pointer-events-none
                                    md:absolute md:bottom-full md:left-1/2 md:mb-4 md:w-56 md:max-w-full
                                    md:-translate-x-1/2 md:translate-y-4 md:rounded-xl md:border md:border-[var(--color-sunset-orange)]/20 md:bg-white/95 md:p-4
                                    md:opacity-0 md:shadow-xl md:backdrop-blur-sm md:transition-all md:group-hover:translate-y-0 md:group-hover:opacity-100"
						>
							<h3
								class="font-display mb-1 text-xl leading-tight font-bold text-[var(--color-deep-forest)] md:text-lg"
							>
								{book.title}
							</h3>
							<p
								class="mb-2 text-sm tracking-wider text-[var(--color-camo-brown)] uppercase opacity-80 md:text-xs"
							>
								{book.author}
							</p>
							<div class="flex flex-col gap-2 md:block">
								<p class="text-xl font-bold text-[var(--color-sunset-orange)] md:text-base">
									{book.price}
								</p>

								<a
									href="https://wa.me/{whatsappNumber}?text=Ol%C3%A1!%20Gostaria%20de%20comprar%20o%20livro%20*{book.title}*"
									target="_blank"
									class="pointer-events-auto mt-2 inline-block rounded-full bg-[var(--color-moss-green)] px-6 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-[var(--color-sunset-orange)] md:hidden"
								>
									Eu Quero!
								</a>
								<span class="mt-1 hidden text-xs text-gray-400 md:inline-block"
									>Clique ou chame no Zap</span
								>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Pagination Controls -->
			{#if totalPages > 1}
				<div class="mt-20 flex items-center justify-center gap-4">
					<button
						class="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-moss-green)] font-bold text-[var(--color-cream)]
                                    shadow-lg transition-all hover:scale-105 hover:bg-[var(--color-sunset-orange)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-[var(--color-moss-green)]"
						on:click={() => goToPage(currentPage - 1)}
						disabled={currentPage === 1}
					>
						&larr;
					</button>

					<span class="font-display text-xl font-bold text-[var(--color-deep-forest)]">
						Página {currentPage} de {totalPages}
					</span>

					<button
						class="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-moss-green)] font-bold text-[var(--color-cream)]
                                    shadow-lg transition-all hover:scale-105 hover:bg-[var(--color-sunset-orange)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-[var(--color-moss-green)]"
						on:click={() => goToPage(currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						&rarr;
					</button>
				</div>
			{/if}
		</div>

		<footer class="mt-20 text-center text-sm text-[var(--color-camo-brown)]/60">
			<p>Bazar da Becca &copy; 2025</p>
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
