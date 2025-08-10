// 3D Skills init with THREE.js
const init3DSkills = () => {
  const container = document.getElementById('skills-3d-container');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.offsetWidth / container.offsetHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.IcosahedronGeometry(1, 0);
  const material = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });
  const skillMesh = new THREE.Mesh(geometry, material);
  scene.add(skillMesh);

  camera.position.z = 3;

  const animate = () => {
    requestAnimationFrame(animate);
    skillMesh.rotation.x += 0.0015;
    skillMesh.rotation.y += 0.0015;
    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
  });
};

// Theme toggle & persistence
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');

const updateThemeIcons = () => {
  const moonIcons = document.querySelectorAll('.fa-moon');
  const sunIcons = document.querySelectorAll('.fa-sun');
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  moonIcons.forEach(icon => icon.classList.toggle('hidden', isDark));
  sunIcons.forEach(icon => icon.classList.toggle('hidden', !isDark));
};

const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('color-theme', theme);
  updateThemeIcons();
};

const toggleTheme = () => {
  const currentTheme = localStorage.getItem('color-theme') || 'light';
  if (currentTheme === 'dark') {
    setTheme('light');
  } else {
    setTheme('dark');
  }
};

themeToggle?.addEventListener('click', toggleTheme);
themeToggleMobile?.addEventListener('click', toggleTheme);

// Initialize theme on load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('color-theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }

  init3DSkills();
  updateThemeIcons();
});

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuButton?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('hidden');
});
mobileMenuButton?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    mobileMenu?.classList.toggle('hidden');
  }
});

// Smooth scroll & active nav link highlight
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }

    // Update active class
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Close mobile menu if open
    if (!mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
    }
  });
});

window.addEventListener('scroll', () => {
  let currentSection = '';
  document.querySelectorAll('section').forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 150) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });

  // Scroll progress bar
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
    progressBar.style.opacity = scrollPercent > 0 ? '1' : '0';
  }
});

// IntersectionObserver for fade-in animations
const fadeElems = document.querySelectorAll('.animate-fade-in, .animate-slide-up');
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeElems.forEach(elem => {
  elem.style.opacity = '0';
  if (elem.classList.contains('animate-slide-up')) {
    elem.style.transform = 'translateY(50px)';
  }
  observer.observe(elem);
});

// Contact form submission
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = e.target.name.value.trim();
  const email = e.target.email.value.trim();
  const message = e.target.message.value.trim();

  if (!name || !email || !message) {
    formStatus.textContent = 'Please fill in all fields.';
    formStatus.style.color = 'red';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    formStatus.textContent = 'Please enter a valid email.';
    formStatus.style.color = 'red';
    return;
  }

  formStatus.textContent = 'Sending...';
  formStatus.style.color = '#ff9800';

  try {
    const res = await fetch('/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });
    const data = await res.json();
    formStatus.textContent = data.message;
    formStatus.style.color = data.success ? 'green' : 'red';
    if (data.success) e.target.reset();
  } catch (err) {
    formStatus.textContent = 'Failed to send message. Try again later.';
    formStatus.style.color = 'red';
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const projectFilters = document.querySelectorAll('.project-filter');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      // Clear active from all buttons
      projectFilters.forEach(f => f.classList.remove('active-filter'));
      // Add active to clicked
      filter.classList.add('active-filter');

      const filterValue = filter.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filterValue === 'all' || card.classList.contains(filterValue)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

const updateThemeIcons = () => {
  const moonIcons = document.querySelectorAll('.fa-moon');
  const sunIcons = document.querySelectorAll('.fa-sun');
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  moonIcons.forEach(icon => icon.classList.toggle('hidden', isDark));
  sunIcons.forEach(icon => icon.classList.toggle('hidden', !isDark));
};

const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('color-theme', theme);
  updateThemeIcons();
};


