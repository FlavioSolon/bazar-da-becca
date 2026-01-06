<script>
  import { page } from '$app/stores';

  let title = 'Bazar da Becca';
  let text = 'Confira os livros disponíveis no Bazar da Becca!';
  let url = $page.url.href;

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copiado para a área de transferência!');
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    }
  }
</script>

<button
  on:click={share}
  class="fixed bottom-6 right-6 z-50 bg-[var(--color-sunset-orange)] text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
  aria-label="Compartilhar"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
  <span class="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap group-hover:ml-2 font-display font-medium">
    Compartilhar
  </span>
</button>
