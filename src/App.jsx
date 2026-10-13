import { lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import useLenis from './hooks/useLenis'
import Layout from './layout/Layout'
import Home from './pages/Home'

const ExperienceIntelligence = lazy(() => import('./pages/ExperienceIntelligence'))
const RealEstateIntelligence = lazy(() => import('./pages/RealEstateIntelligence'))
const Plans = lazy(() => import('./pages/Plans'))
const Security = lazy(() => import('./pages/Security'))
const Contact = lazy(() => import('./pages/Contact'))
const Company = lazy(() => import('./pages/Company'))
const Careers = lazy(() => import('./pages/Careers'))
const Legal = lazy(() => import('./pages/Legal'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const CaseStudies = lazy(() => import('./pages/CaseStudies'))
const CaseStudy = lazy(() => import('./pages/CaseStudy'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  useLenis()
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="experience-intelligence" element={<ExperienceIntelligence />} />
          <Route path="realestate-intelligence" element={<RealEstateIntelligence />} />
          <Route path="plans" element={<Plans />} />
          <Route path="security" element={<Security />} />
          <Route path="contact" element={<Contact />} />
          <Route path="company" element={<Company />} />
          <Route path="careers" element={<Careers />} />
          <Route path="imprint" element={<Legal page="imprint" />} />
          <Route path="data-privacy" element={<Legal page="data-privacy" />} />
          <Route path="terms-of-service" element={<Legal page="terms-of-service" />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="case-studies" element={<CaseStudies />} />
          <Route path="case-studies/:slug" element={<CaseStudy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
