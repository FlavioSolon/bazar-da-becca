<script>
	import { fade, fly, slide, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	export let data;
	export let form;

	let searchTerm = '';
	let selectedCategory = 'Todos';
	let visibilityFilter = 'all';
	let currentPage = 1;
	const itemsPerPage = 10;

	let showAddForm = false;
	let isAuthenticated = false;
	let isChecking = true;
	let passwordInput = '';
	let authError = false;
	let isSubmitting = false;

	let showDeleteModal = false;
	let productToDelete = null;

	let showImageModal = false;
	let selectedImage = null;

	let editingProduct = null;

	let isReordering = false;
	let reorderItems = [];
	let isSavingOrder = false;

	const categories = [
		'Todos',
		'Literatura Brasileira',
		'Literatura Estrangeira',
		'Técnico / Acadêmico',
		'Religioso',
		'Autoajuda',
		'Infantil',
		'HQ / Mangá',
		'Outros'
	];

	onMount(() => {
		if (sessionStorage.getItem('admin_authenticated') === 'true') {
			isAuthenticated = true;
		}
		isChecking = false;
	});

	function handleLogin() {
		if (passwordInput.toLowerCase() === 'ohana') {
			isAuthenticated = true;
			sessionStorage.setItem('admin_authenticated', 'true');
			authError = false;
		} else {
			authError = true;
			passwordInput = '';
			setTimeout(() => (authError = false), 2000);
		}
	}

	function promptDelete(id) {
		productToDelete = id;
		showDeleteModal = true;
	}

	function closeDeleteModal() {
		showDeleteModal = false;
		setTimeout(() => (productToDelete = null), 300);
	}

	function openImageModal(url) {
		selectedImage = url;
		showImageModal = true;
	}

	function closeImageModal() {
		showImageModal = false;
		setTimeout(() => (selectedImage = null), 300);
	}

	function startEdit(product) {
		editingProduct = product;
		showAddForm = true;
		setTimeout(() => {
			document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
		}, 100);
	}

	function cancelEdit() {
		editingProduct = null;
		showAddForm = false;
	}

	function toggleReorder() {
		isReordering = !isReordering;
		if (isReordering) {
			lastFilterState = JSON.stringify({ selectedCategory, searchTerm, visibilityFilter });
			reorderItems = [...filteredProducts]
				.filter((p) => p.is_visible)
				.sort((a, b) => (a.position || 0) - (b.position || 0));
			if (reorderItems.every((p) => !p.position)) {
				reorderItems.sort((a, b) => b.id - a.id);
			}
		}
	}

	let lastFilterState = JSON.stringify({ selectedCategory, searchTerm, visibilityFilter });

	$: if (isReordering) {
		const currentFilterState = JSON.stringify({ selectedCategory, searchTerm, visibilityFilter });
		if (currentFilterState !== lastFilterState) {
			lastFilterState = currentFilterState;
			reorderItems = [...filteredProducts]
				.filter((p) => p.is_visible)
				.sort((a, b) => (a.position || 0) - (b.position || 0));

			if (reorderItems.every((p) => !p.position)) {
				reorderItems.sort((a, b) => b.id - a.id);
			}
		}
	}

	function sortByCategories() {
		reorderItems = [...reorderItems].sort((a, b) => {
			const catCompare = a.category.localeCompare(b.category);
			if (catCompare !== 0) return catCompare;
			return a.title.localeCompare(b.title);
		});
	}

	function handleDndConsider(e) {
		reorderItems = e.detail.items;
	}

	function handleDndFinalize(e) {
		reorderItems = e.detail.items;
	}

	function transformDraggedElement(draggedEl, data, index) {
		draggedEl.style.opacity = '0.9';
		draggedEl.style.transform = 'scale(1.02)';
		draggedEl.style.boxShadow =
			'0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
		draggedEl.style.zIndex = '10000';
		draggedEl.style.cursor = 'grabbing';
	}

	async function saveOrder() {
		isSavingOrder = true;
		let allProducts = [...data.products].sort((a, b) => (a.position || 0) - (b.position || 0));
		if (allProducts.every((p) => !p.position)) {
			allProducts.sort((a, b) => b.id - a.id);
		}

		const reorderIds = new Set(reorderItems.map((i) => i.id));
		const indicesToUpdate = [];

		allProducts.forEach((item, index) => {
			if (reorderIds.has(item.id)) {
				indicesToUpdate.push(index);
			}
		});

		const updates = reorderItems.map((item, i) => ({
			id: item.id,
			position: indicesToUpdate[i]
		}));

		try {
			const orderInput = document.getElementById('orderInput');
			if (orderInput) {
				orderInput.value = JSON.stringify(updates);
			}
			document.getElementById('saveOrderForm').requestSubmit();
		} catch (error) {
			console.error('Error saving order:', error);
			alert('Erro ao salvar a ordem.');
			isSavingOrder = false;
		}
	}

	$: filteredProducts = data.products.filter((product) => {
		const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
		const matchesVisibility =
			visibilityFilter === 'all'
				? true
				: visibilityFilter === 'visible'
					? product.is_visible
					: !product.is_visible;
		return matchesSearch && matchesCategory && matchesVisibility;
	});

	$: {
		if (searchTerm || selectedCategory || visibilityFilter) {
			currentPage = 1;
		}
	}

	$: totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
	$: paginatedProducts = filteredProducts.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	function goToPage(page) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			document.getElementById('products-list')?.scrollIntoView({ behavior: 'smooth' });
		}
	}

	const handleSubmit = async ({ formData, cancel }) => {
		isSubmitting = true;
		const heic2any = (await import('heic2any')).default;

		const processFile = async (fieldName) => {
			const file = formData.get(fieldName);
			if (
				file &&
				file.size > 0 &&
				(file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif'))
			) {
				try {
					const convertedBlob = await heic2any({
						blob: file,
						toType: 'image/jpeg',
						quality: 0.8
					});
					const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
					const newFile = new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
						type: 'image/jpeg'
					});
					formData.set(fieldName, newFile);
				} catch (error) {
					console.error(`Error converting ${fieldName}:`, error);
					alert(`Erro ao converter imagem ${file.name}. Tente enviar uma JPG ou PNG.`);
					cancel();
					isSubmitting = false;
				}
			}
		};

		await processFile('image_1');
		await processFile('image_2');
		await processFile('image_3');

		return async ({ update }) => {
			await update();
			isSubmitting = false;
			showAddForm = false;
			editingProduct = null;
		};
	};
</script>

{#if isChecking}
	<div class="min-h-screen bg-[var(--color-cream)]"></div>
{:else if !isAuthenticated}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-deep-forest)]"
		in:fade
	>
		<div
			class="pointer-events-none absolute inset-0 opacity-10"
			style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 30px 30px;"
		></div>

		<div
			class="relative mx-4 w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/95 p-10 text-center shadow-2xl backdrop-blur-sm"
			in:scale={{ start: 0.95, duration: 400 }}
		>
			<div
				class="absolute top-0 left-0 h-3 w-full bg-gradient-to-r from-[var(--color-sunset-orange)] via-yellow-500 to-[var(--color-deep-forest)]"
			></div>

			<div class="mt-2 mb-8">
				<h2 class="font-display mb-3 text-4xl leading-tight text-[var(--color-deep-forest)]">
					Bazar da Becca
				</h2>
				<p class="font-display text-2xl text-[var(--color-deep-forest)]/80 italic">
					A leitura nos une.
				</p>
			</div>

			<form on:submit|preventDefault={handleLogin} class="space-y-6">
				<div class="group relative">
					<input
						type="password"
						bind:value={passwordInput}
						placeholder="Senha..."
						class="font-display w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-6 py-4 text-center text-xl tracking-widest text-[var(--color-deep-forest)] placeholder-gray-300 transition-all outline-none focus:border-[var(--color-sunset-orange)] focus:bg-white focus:ring-4 focus:ring-[var(--color-sunset-orange)]/10 {authError
							? 'animate-pulse border-red-500'
							: ''}"
						autofocus
					/>
				</div>

				<button
					type="submit"
					class="w-full transform rounded-xl bg-gradient-to-r from-[var(--color-deep-forest)] to-[#2a5c50] px-8 py-4 text-lg font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-[var(--color-sunset-orange)] hover:to-[#ff8c3a] hover:shadow-2xl"
				>
					Entrar
				</button>
			</form>

			{#if authError}
				<p
					class="mt-4 inline-block rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-500"
					in:fly={{ y: 10 }}
				>
					Senha incorreta.
				</p>
			{/if}

			<div class="mt-8 font-sans text-xs text-gray-400">Área restrita.</div>
		</div>
	</div>
{:else}
	<div class="admin-font min-h-screen bg-[var(--color-cream)] pb-20" in:fade>
		<header class="sticky top-0 z-40 bg-[var(--color-deep-forest)] px-4 py-6 text-white shadow-lg">
			<div class="container mx-auto flex items-center justify-between">
				<h1 class="font-display text-2xl md:text-3xl">Painel Admin</h1>
				<div class="flex items-center gap-4">
					<button
						class="rounded-full bg-white/10 px-4 py-2 text-sm font-bold transition-colors hover:bg-white/20"
						on:click={toggleReorder}
					>
						{isReordering ? 'Sair da Ordenação' : 'Ordenar Livros'}
					</button>
					<a
						href="/"
						class="text-sm font-bold transition-colors hover:text-[var(--color-sunset-orange)]"
						>Ver Loja &rarr;</a
					>
				</div>
			</div>
		</header>

		<div class="relative z-10 container mx-auto -mt-8 max-w-6xl p-4">
			{#if form?.message}
				<div
					class="mb-6 rounded border-l-4 border-red-500 bg-red-100 p-4 text-red-700 shadow-md"
					role="alert"
					in:fly={{ y: -20, duration: 500 }}
				>
					<p class="font-bold">Atenção</p>
					<p>{form.message}</p>
				</div>
			{/if}
			{#if form?.success}
				<div
					class="mb-6 rounded border-l-4 border-green-500 bg-green-100 p-4 text-green-700 shadow-md"
					role="alert"
					in:fly={{ y: -20, duration: 500 }}
				>
					<p class="font-bold">Sucesso</p>
					<p>Operação realizada com sucesso!</p>
				</div>
			{/if}

			{#if isReordering}
				<div class="mb-8 overflow-hidden rounded-2xl bg-white p-6 shadow-xl" in:fade>
					<div class="mb-6 flex items-center justify-between">
						<div class="flex items-center gap-4">
							<div>
								<h2 class="font-display text-2xl text-[var(--color-deep-forest)]">
									Ordenar Livros
								</h2>
								<p class="text-sm text-gray-500">Arraste os itens para mudar a ordem.</p>
							</div>
							<select
								bind:value={selectedCategory}
								class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold outline-none focus:border-[var(--color-sunset-orange)]"
							>
								{#each categories as cat}
									<option value={cat}>{cat}</option>
								{/each}
							</select>
							<button
								on:click={sortByCategories}
								class="rounded-full border border-[var(--color-sunset-orange)] px-3 py-1 text-sm font-bold text-[var(--color-sunset-orange)] hover:bg-orange-50"
								>Auto-agrupar</button
							>
						</div>
						<form
							method="POST"
							action="?/updateOrder"
							id="saveOrderForm"
							use:enhance={() => {
								isSavingOrder = true;
								return async ({ update, result }) => {
									await update();
									isSavingOrder = false;
									if (result.type === 'success') isReordering = false;
								};
							}}
						>
							<input type="hidden" name="order" id="orderInput" />
							<button
								type="button"
								on:click={saveOrder}
								class="rounded-full bg-[var(--color-sunset-orange)] px-8 py-3 font-bold text-white shadow-lg hover:bg-orange-600 disabled:opacity-50"
								disabled={isSavingOrder}
							>
								{isSavingOrder ? 'Salvando...' : 'Salvar Ordem'}
							</button>
						</form>
					</div>

					<div
						use:dndzone={{
							items: reorderItems,
							flipDurationMs: 300,
							transformDraggedElement,
							dropTargetStyle: {
								outline: '2px solid var(--color-sunset-orange)',
								borderRadius: '0.5rem'
							}
						}}
						on:consider={handleDndConsider}
						on:finalize={handleDndFinalize}
						class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
					>
						{#each reorderItems as item (item.id)}
							<div
								class="flex cursor-move items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm hover:border-[var(--color-sunset-orange)]"
								animate:flip={{ duration: 300 }}
							>
								<div class="text-xl font-bold text-gray-400">☰</div>
								{#if item.image_1}
									<img
										src={item.image_1}
										alt={item.title}
										class="h-16 w-16 rounded-lg bg-gray-200 object-cover"
									/>
								{:else}
									<div
										class="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-400"
									>
										Sem img
									</div>
								{/if}
								<div class="min-w-0 flex-1">
									<h3 class="truncate font-bold text-[var(--color-deep-forest)]">{item.title}</h3>
									<p class="text-sm text-gray-500">{item.category} • {item.price}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<div class="mb-8 overflow-hidden rounded-2xl bg-white shadow-xl">
					<button
						class="flex w-full items-center justify-between bg-white p-6 text-left transition-colors hover:bg-gray-50"
						on:click={() => (showAddForm = !showAddForm)}
					>
						<div>
							<h2 class="font-display text-xl text-[var(--color-deep-forest)]">
								Adicionar Novo Livro
							</h2>
							<p class="mt-1 text-sm text-gray-500">
								Clique para {showAddForm ? 'fechar' : 'abrir'} o formulário
							</p>
						</div>
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-cream)] text-xl font-bold text-[var(--color-deep-forest)] transition-transform duration-300 {showAddForm
								? 'rotate-45'
								: ''}"
						>
							+
						</div>
					</button>

					{#if showAddForm}
						<div transition:slide class="border-t border-gray-100 bg-gray-50/50 p-6">
							<div class="mb-4 flex items-center justify-between">
								<h3 class="text-lg font-bold text-[var(--color-deep-forest)]">
									{editingProduct ? 'Editar Livro' : 'Novo Livro'}
								</h3>
								{#if editingProduct}
									<button
										on:click={cancelEdit}
										class="text-sm font-bold text-red-500 hover:underline">Cancelar Edição</button
									>
								{/if}
							</div>
							<form
								method="POST"
								action={editingProduct ? '?/update' : '?/create'}
								use:enhance={handleSubmit}
								enctype="multipart/form-data"
								class="grid grid-cols-1 gap-6 md:grid-cols-2"
							>
								{#if editingProduct}
									<input type="hidden" name="id" value={editingProduct.id} />
								{/if}

								<div class="md:col-span-2">
									<label
										class="mb-2 block text-sm font-bold text-[var(--color-deep-forest)]"
										for="title">Título do Livro</label
									>
									<input
										class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all outline-none focus:border-[var(--color-sunset-orange)] focus:ring-2 focus:ring-[var(--color-sunset-orange)]/20"
										id="title"
										name="title"
										type="text"
										placeholder="Ex: Dom Casmurro"
										value={editingProduct?.title || ''}
										required
									/>
								</div>

								<div>
									<label
										class="mb-2 block text-sm font-bold text-[var(--color-deep-forest)]"
										for="price">Preço</label
									>
									<input
										class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-sunset-orange)]"
										id="price"
										name="price"
										type="text"
										placeholder="Ex: R$ 25,00"
										value={editingProduct?.price || ''}
										required
									/>
								</div>

								<div>
									<label
										class="mb-2 block text-sm font-bold text-[var(--color-deep-forest)]"
										for="category">Categoria</label
									>
									<select
										class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[var(--color-sunset-orange)]"
										id="category"
										name="category"
										value={editingProduct?.category || ''}
										required
									>
										<option value="" disabled selected={!editingProduct}>Selecione...</option>
										{#each categories.filter((c) => c !== 'Todos') as cat}
											<option value={cat}>{cat}</option>
										{/each}
									</select>
								</div>

								<div class="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-3">
									<div>
										<label
											class="mb-2 block text-sm font-bold text-[var(--color-deep-forest)]"
											for="image_1">Capa {editingProduct ? '(Opcional)' : '(Obrigatória)'}</label
										>
										{#if editingProduct?.image_1}
											<div class="mb-2">
												<button
													type="button"
													on:click={() => openImageModal(editingProduct.image_1)}
													class="group relative overflow-hidden rounded-lg border border-gray-200 hover:border-[var(--color-sunset-orange)]"
												>
													<img
														src={editingProduct.image_1}
														alt="Capa"
														class="h-20 w-20 object-cover"
													/>
												</button>
											</div>
										{/if}
										<input
											class="w-full"
											id="image_1"
											name="image_1"
											type="file"
											accept="image/*,.heic,.heif"
											required={!editingProduct}
										/>
									</div>
									<div>
										<label
											class="mb-2 block text-sm font-bold text-[var(--color-deep-forest)]"
											for="image_2">Imagem 2 (Opcional)</label
										>
										<input
											class="w-full"
											id="image_2"
											name="image_2"
											type="file"
											accept="image/*,.heic,.heif"
										/>
									</div>
									<div>
										<label
											class="mb-2 block text-sm font-bold text-[var(--color-deep-forest)]"
											for="image_3">Imagem 3 (Opcional)</label
										>
										<input
											class="w-full"
											id="image_3"
											name="image_3"
											type="file"
											accept="image/*,.heic,.heif"
										/>
									</div>
								</div>

								<div>
									<label
										class="mb-2 block text-sm font-bold text-[var(--color-deep-forest)]"
										for="buy_link">Link de Contato</label
									>
									<input
										class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-sunset-orange)]"
										id="buy_link"
										name="buy_link"
										type="text"
										placeholder="https://wa.me/..."
										value={editingProduct?.buy_link || 'https://wa.me/5592981496477'}
										required
									/>
								</div>

								<div class="mt-4 flex justify-end md:col-span-2">
									<button
										class="rounded-full bg-[var(--color-deep-forest)] px-8 py-3 font-bold text-white shadow-lg transition-all hover:bg-[var(--color-sunset-orange)] disabled:opacity-50"
										type="submit"
										disabled={isSubmitting}
									>
										{isSubmitting
											? 'Salvando...'
											: editingProduct
												? 'Atualizar Livro'
												: 'Salvar Livro'}
									</button>
								</div>
							</form>
						</div>
					{/if}
				</div>

				<div
					class="sticky top-20 z-30 mb-6 flex flex-col items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-md md:flex-row"
				>
					<div class="relative w-full md:flex-1">
						<div
							class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"
						>
							🔍
						</div>
						<input
							type="text"
							bind:value={searchTerm}
							placeholder="Buscar por título..."
							class="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-10 outline-none focus:border-[var(--color-deep-forest)]"
						/>
					</div>
					<div class="w-full md:w-auto">
						<select
							bind:value={selectedCategory}
							class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 outline-none md:w-48"
						>
							{#each categories as cat}
								<option value={cat}>{cat}</option>
							{/each}
						</select>
					</div>
					<div class="w-full md:w-auto">
						<select
							bind:value={visibilityFilter}
							class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 outline-none md:w-48"
						>
							<option value="all">Todos Status</option>
							<option value="visible">Visíveis</option>
							<option value="hidden">Ocultos</option>
						</select>
					</div>
				</div>

				<div id="products-list" class="overflow-hidden rounded-2xl bg-white shadow-xl">
					<div class="flex items-center justify-between border-b border-gray-100 p-6">
						<h2 class="font-display text-xl text-[var(--color-deep-forest)]">
							Livros Cadastrados <span class="ml-2 font-sans text-sm text-gray-400"
								>({filteredProducts.length})</span
							>
						</h2>
					</div>

					<div class="hidden overflow-x-auto md:block">
						<table class="w-full border-collapse text-left">
							<thead>
								<tr
									class="bg-gray-50 text-sm tracking-wider text-[var(--color-deep-forest)] uppercase"
								>
									<th class="px-6 py-4 font-bold">Livro</th>
									<th class="px-6 py-4 font-bold">Categoria</th>
									<th class="px-6 py-4 font-bold">Preço</th>
									<th class="px-6 py-4 text-center font-bold">Visibilidade</th>
									<th class="px-6 py-4 text-right font-bold">Ações</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-100">
								{#each paginatedProducts as product (product.id)}
									<tr class="group transition-colors hover:bg-gray-50">
										<td class="px-6 py-4">
											<div class="flex items-center gap-4">
												{#if product.image_1}
													<button
														type="button"
														class="h-12 w-12 overflow-hidden rounded-lg bg-gray-100"
														on:click={() => openImageModal(product.image_1)}
													>
														<img
															src={product.image_1}
															alt={product.title}
															class="h-full w-full object-cover"
														/>
													</button>
												{/if}
												<span class="font-medium text-gray-900">{product.title}</span>
											</div>
										</td>
										<td class="px-6 py-4"
											><span
												class="rounded-full bg-[var(--color-cream)] px-3 py-1 text-xs font-bold text-[var(--color-deep-forest)]"
												>{product.category}</span
											></td
										>
										<td class="px-6 py-4 font-bold text-[var(--color-sunset-orange)]"
											>{product.price}</td
										>
										<td class="px-6 py-4 text-center">
											<form
												method="POST"
												action="?/toggleVisibility"
												use:enhance
												class="inline-block"
											>
												<input type="hidden" name="id" value={product.id} />
												<input type="hidden" name="is_visible" value={product.is_visible} />
												<button
													type="submit"
													class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors {product.is_visible
														? 'bg-[var(--color-deep-forest)]'
														: 'bg-gray-200'}"
												>
													<span
														class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {product.is_visible
															? 'translate-x-6'
															: 'translate-x-1'}"
													></span>
												</button>
											</form>
										</td>
										<td class="px-6 py-4 text-right">
											<button
												on:click={() => startEdit(product)}
												class="mr-2 text-gray-400 hover:text-[var(--color-sunset-orange)]"
												title="Editar">✎</button
											>
											<button
												on:click={() => promptDelete(product.id)}
												class="text-gray-400 hover:text-red-500"
												title="Excluir">🗑</button
											>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<!-- Mobile Cards (Simply showing titles for brevity, assuming responsive layout is critical) -->
					<div class="grid grid-cols-1 gap-4 bg-gray-50 p-4 md:hidden">
						{#each paginatedProducts as product (product.id)}
							<div
								class="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
								in:fly={{ y: 20, duration: 300 }}
							>
								{#if product.image_1}
									<button
										type="button"
										class="h-24 w-24 overflow-hidden rounded-lg bg-gray-100 object-cover"
										on:click={() => openImageModal(product.image_1)}
									>
										<img
											src={product.image_1}
											alt={product.title}
											class="h-full w-full object-cover"
										/>
									</button>
								{/if}
								<div class="min-w-0 flex-1">
									<h3 class="truncate font-bold text-[var(--color-deep-forest)]">
										{product.title}
									</h3>
									<p class="font-bold text-[var(--color-sunset-orange)]">{product.price}</p>
									<span class="rounded bg-gray-100 px-2 py-1 text-xs">{product.category}</span>
									<div class="mt-2 flex justify-end gap-2">
										<button on:click={() => startEdit(product)} class="text-gray-400">✎</button>
										<button on:click={() => promptDelete(product.id)} class="text-red-500"
											>🗑</button
										>
									</div>
								</div>
							</div>
						{/each}
					</div>

					{#if filteredProducts.length === 0}
						<div class="p-12 text-center text-gray-400">
							<p class="text-xl">Nenhum livro encontrado.</p>
						</div>
					{/if}

					{#if totalPages > 1}
						<div class="flex items-center justify-center gap-2 border-t border-gray-100 p-6">
							<button
								class="h-10 w-10 rounded-full bg-gray-100 disabled:opacity-50"
								on:click={() => goToPage(currentPage - 1)}
								disabled={currentPage === 1}>&lt;</button
							>
							<span class="text-sm font-bold">Página {currentPage} de {totalPages}</span>
							<button
								class="h-10 w-10 rounded-full bg-gray-100 disabled:opacity-50"
								on:click={() => goToPage(currentPage + 1)}
								disabled={currentPage === totalPages}>&gt;</button
							>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	{#if showDeleteModal}
		<div
			class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
			transition:fade
		>
			<div class="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
				<h3 class="font-display mb-2 text-2xl text-[var(--color-deep-forest)]">Excluir Livro?</h3>
				<p class="mb-6 text-gray-500">Essa ação não pode ser desfeita.</p>
				<div class="flex justify-center gap-4">
					<button
						on:click={closeDeleteModal}
						class="rounded-full border border-gray-200 px-6 py-2 font-bold hover:bg-gray-50"
						>Cancelar</button
					>
					<form method="POST" action="?/delete" use:enhance>
						<input type="hidden" name="id" value={productToDelete} />
						<button
							type="submit"
							on:click={closeDeleteModal}
							class="rounded-full bg-red-500 px-6 py-2 font-bold text-white shadow-lg hover:bg-red-600"
							>Excluir</button
						>
					</form>
				</div>
			</div>
		</div>
	{/if}

	{#if showImageModal && selectedImage}
		<div
			class="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
			transition:fade
			on:click|self={closeImageModal}
		>
			<button on:click={closeImageModal} class="absolute top-4 right-4 p-2 text-white">✕</button>
			<img
				src={selectedImage}
				alt="Visualização"
				class="max-h-[85vh] max-w-full rounded-lg object-contain"
				in:scale={{ start: 0.9, duration: 300 }}
			/>
		</div>
	{/if}
{/if}

<style>
	:global(.admin-font) {
		--font-display: 'Helvetica', 'Helvetica Neue', Arial, sans-serif;
		font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif;
	}
	:global(.admin-font h1),
	:global(.admin-font h2),
	:global(.admin-font h3) {
		font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif;
	}
</style>
