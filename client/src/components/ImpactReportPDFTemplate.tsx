import React, { useEffect, useState } from 'react';
import './ImpactReportPDF.css';
import '../../assets/fonts/fonts.css';
import {
  fetchHeroContent,
  fetchMissionContent,
  fetchPopulationContent,
  fetchFinancialContent,
  fetchMethodContent,
  fetchCurriculumContent,
  fetchImpactSectionContent,
  fetchTestimonialsContent,
  fetchNationalImpactContent,
  fetchFlexAContent,
  fetchFlexBContent,
  fetchFlexCContent,
  fetchImpactLevelsContent,
  fetchPartnersContent,
  fetchFooterContent,
} from '../services/impact.api';

/**
 * Impact Report PDF Template Component
 * 
 * This component renders a print-optimized version of the GOGO Impact Report
 * matching the 2024 PDF design. It fetches real data from the database.
 * 
 * Structure: ~15-20 pages based on the official 2024 Impact Report
 */

const ImpactReportPDFTemplate: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // Fetch all data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          hero,
          mission,
          population,
          financial,
          method,
          curriculum,
          impactSection,
          testimonials,
          nationalImpact,
          flexA,
          flexB,
          flexC,
          impactLevels,
          partners,
          footer,
        ] = await Promise.all([
          fetchHeroContent(),
          fetchMissionContent(),
          fetchPopulationContent(),
          fetchFinancialContent(),
          fetchMethodContent(),
          fetchCurriculumContent(),
          fetchImpactSectionContent(),
          fetchTestimonialsContent(),
          fetchNationalImpactContent(),
          fetchFlexAContent(),
          fetchFlexBContent(),
          fetchFlexCContent(),
          fetchImpactLevelsContent(),
          fetchPartnersContent(),
          fetchFooterContent(),
        ]);

        setData({
          hero,
          mission,
          population,
          financial,
          method,
          curriculum,
          impactSection,
          testimonials,
          nationalImpact,
          flexA,
          flexB,
          flexC,
          impactLevels,
          partners,
          footer,
        });
        setLoading(false);

        // Auto-trigger print dialog after data loads
        setTimeout(() => {
          window.print();
        }, 1000);
      } catch (error) {
        console.error('Error loading PDF data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0a0a0a',
        color: 'white',
        fontFamily: 'Century Gothic, Arial, sans-serif',
        fontSize: '18pt'
      }}>
        Loading Impact Report...
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0a0a0a',
        color: 'white',
        fontFamily: 'Century Gothic, Arial, sans-serif',
        fontSize: '18pt'
      }}>
        Error loading data. Please try again.
      </div>
    );
  }

  return (
    <div className="pdf-report-container">
      {/* PAGE 1: COVER */}
      <div className="pdf-page pdf-cover-page" style={{
        backgroundImage: data.hero?.backgroundImage 
          ? `linear-gradient(135deg, rgba(10, 10, 10, 0.7) 0%, rgba(25, 70, 245, 0.8) 40%, rgba(104, 54, 154, 0.7) 100%), url(${data.hero.backgroundImage})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: data.hero?.backgroundImageGrayscale ? 'grayscale(100%)' : undefined,
      }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div className="pdf-cover-year" style={{ marginBottom: '0.3in' }}>
            {data.hero?.year || data.hero?.subtitle || '2024'}
          </div>
          <div className="pdf-cover-title">
            {data.hero?.title || 'GUITARS OVER GUNS'}
          </div>
          <div style={{ 
            fontFamily: 'Airwaves, Century Gothic, Arial, sans-serif',
            fontSize: '36pt',
            fontWeight: 600,
            color: 'rgba(141, 221, 166, 0.9)',
            marginTop: '0.3in',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            Impact Report
          </div>
          <div style={{
            marginTop: '1in',
            display: 'flex',
            justifyContent: 'center',
            gap: '0.4in',
            flexWrap: 'wrap',
            fontSize: '11pt',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            <div>Miami</div>
            <div style={{ color: 'rgba(141, 221, 166, 0.6)' }}>•</div>
            <div>Chicago</div>
            <div style={{ color: 'rgba(141, 221, 166, 0.6)' }}>•</div>
            <div>Los Angeles</div>
            <div style={{ color: 'rgba(141, 221, 166, 0.6)' }}>•</div>
            <div>New York</div>
          </div>
        </div>
      </div>

      {/* PAGE 2: MISSION & AT-A-GLANCE - Ticket Style */}
      <div className="pdf-page pdf-mission-page">
        {/* Top Half - Ticket Section */}
        <div className="pdf-mission-ticket-section">
          <div className="pdf-mission-ticket">
            <div className="pdf-mission-ticket-serial">NO. 2024-001</div>
            <div className="pdf-mission-ticket-header">
              {data.mission?.badgeLabel || 'Our Mission'}
            </div>
            <h1 className="pdf-mission-title">
              {data.mission?.statementText || data.mission?.title || 'Empowering Youth Through Music, Art and Mentorship'}
            </h1>
            {data.mission?.statementMeta && (
              <p style={{ 
                textAlign: 'center', 
                fontSize: '10pt', 
                color: 'rgba(255, 255, 255, 0.7)',
                marginTop: '0.2in',
                fontStyle: 'italic'
              }}>
                {data.mission.statementMeta}
              </p>
            )}
            <div className="pdf-mission-ticket-perforation"></div>
          </div>
        </div>

        {/* Bottom Half - Stats Section */}
        <div className="pdf-mission-stats-section">
          <h2 className="pdf-section-subheader pdf-text-center" style={{ marginBottom: '0.3in', fontSize: '18pt' }}>
            {data.mission?.statsTitle || '2024 At A Glance'}
          </h2>
          
          <div className="pdf-stats-grid">
            {data.mission?.stats?.filter((stat: any) => stat.visible !== false).slice(0, 4).map((stat: any, index: number) => (
              <div key={index} className="pdf-stat-card">
                <div className="pdf-stat-number">{stat.number}</div>
                <div className="pdf-stat-label">{stat.label}</div>
                {stat.action === 'openModal' && (
                  <div style={{
                    fontSize: '8pt',
                    color: 'rgba(141, 221, 166, 0.7)',
                    marginTop: '0.05in',
                    fontStyle: 'italic'
                  }}>
                    Click to explore in webapp
                  </div>
                )}
              </div>
            ))}
          </div>

          {data.nationalImpact?.regions && data.nationalImpact.regions.length > 0 && (
            <div className="pdf-cities-row">
              {data.nationalImpact.regions.map((region: any, index: number) => (
                <div key={index} className="pdf-city-bubble">
                  <strong>{region.name}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PAGE 3: OUR IMPACT - STATS & CAROUSEL */}
      <div className="pdf-page pdf-impact-measurement-page">
        <h1 className="pdf-section-header">{data.impactSection?.statsTitle || 'Our Impact'}</h1>
        
        {data.impactSection?.highlightsSubtitle && (
          <h2 className="pdf-section-subheader">{data.impactSection.highlightsSubtitle}</h2>
        )}
        
        {data.impactSection?.turntableStats && data.impactSection.turntableStats.length > 0 && (
          <div className="pdf-impact-stats-row">
            {data.impactSection.turntableStats.slice(0, 3).map((stat: any, index: number) => (
              <div key={index} className="pdf-impact-stat">
                <div className="pdf-impact-percentage">{stat.number}</div>
                <p className="pdf-impact-description">{stat.caption}</p>
              </div>
            ))}
          </div>
        )}

        {data.impactSection?.topCarouselImages && data.impactSection.topCarouselImages.length > 0 && (
          <div style={{ marginTop: '0.4in', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.15in' }}>
            {data.impactSection.topCarouselImages.slice(0, 6).map((imageUrl: string, index: number) => (
              <img 
                key={index}
                src={imageUrl} 
                alt={`Impact ${index + 1}`} 
                style={{ 
                  width: '100%', 
                  height: '1.5in', 
                  objectFit: 'cover', 
                  borderRadius: '8px',
                  border: '2px solid rgba(141, 221, 166, 0.3)'
                }} 
              />
            ))}
          </div>
        )}

        {data.impactSection?.highlightChips && data.impactSection.highlightChips.length > 0 && (
          <div style={{ marginTop: '0.3in', display: 'flex', flexWrap: 'wrap', gap: '0.1in', justifyContent: 'center' }}>
            {data.impactSection.highlightChips.map((chip: any, index: number) => (
              <div key={index} style={{
                padding: '0.1in 0.2in',
                background: 'rgba(141, 221, 166, 0.2)',
                border: '2px solid rgba(141, 221, 166, 0.5)',
                borderRadius: '20px',
                fontSize: '10pt',
                fontWeight: 600,
                color: 'white'
              }}>
                {chip.text}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAGE 4: OUR METHOD - MEASUREMENT TOOLS & CARDS */}
      <div className="pdf-page pdf-method-page">
        <h1 className="pdf-section-header">{data.impactSection?.measureTitle || 'How We Measure Impact'}</h1>
        
        {data.impactSection?.measureSubtitle && (
          <h2 className="pdf-section-subheader" style={{ marginBottom: '0.3in' }}>
            {data.impactSection.measureSubtitle}
          </h2>
        )}

        {data.impactSection?.methodItems && data.impactSection.methodItems.length > 0 && (
          <div className="pdf-method-grid">
            {data.impactSection.methodItems.map((item: any, index: number) => (
              <div key={index} className="pdf-method-card">
                <h3 className="pdf-method-title">{item.title}</h3>
                <p className="pdf-method-description">{item.description}</p>
              </div>
            ))}
          </div>
        )}

        {data.impactSection?.toolItems && data.impactSection.toolItems.length > 0 && (
          <div style={{ marginTop: '0.4in' }}>
            <h3 className="pdf-section-subheader">Our Tools</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.2in', marginTop: '0.2in' }}>
              {data.impactSection.toolItems.map((tool: any, index: number) => (
                <div key={index} style={{
                  padding: '0.15in',
                  background: 'rgba(25, 70, 245, 0.1)',
                  border: '2px solid rgba(25, 70, 245, 0.3)',
                  borderRadius: '8px'
                }}>
                  <h4 style={{ color: '#1946f5', fontSize: '11pt', marginBottom: '0.05in' }}>{tool.title}</h4>
                  <p style={{ fontSize: '9pt', color: 'rgba(255,255,255,0.9)' }}>{tool.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.impactSection?.bottomCarouselImages && data.impactSection.bottomCarouselImages.length > 0 && (
          <div style={{ marginTop: '0.4in', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.15in' }}>
            {data.impactSection.bottomCarouselImages.slice(0, 3).map((imageUrl: string, index: number) => (
              <img 
                key={index}
                src={imageUrl} 
                alt={`Method ${index + 1}`} 
                style={{ 
                  width: '100%', 
                  height: '1.5in', 
                  objectFit: 'cover', 
                  borderRadius: '8px',
                  border: '2px solid rgba(141, 221, 166, 0.3)'
                }} 
              />
            ))}
          </div>
        )}
      </div>

      {/* PAGE 5: WHO WE SERVE */}
      <div className="pdf-page pdf-population-page">
        <h1 className="pdf-section-header">{data.population?.sectionTitle || 'Who We Serve'}</h1>
        
        {data.population?.title && (
          <h2 className="pdf-section-subheader" style={{ marginBottom: '0.3in' }}>
            {data.population.title}
          </h2>
        )}

        {data.population?.stats && data.population.stats.length > 0 && (
          <div className="pdf-two-column">
            {data.population.stats.slice(0, 4).map((stat: any, index: number) => (
              <div key={index} className="pdf-demographics-box">
                <div className="pdf-highlight-stat" style={{ fontSize: '42pt' }}>{stat.value}</div>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {data.population?.carouselImages && data.population.carouselImages.length > 0 && (
          <div style={{ marginTop: '0.4in', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.15in' }}>
            {data.population.carouselImages.slice(0, 4).map((imageUrl: string, index: number) => (
              <img 
                key={index}
                src={imageUrl} 
                alt={`Population ${index + 1}`} 
                style={{ 
                  width: '100%', 
                  height: '1.8in', 
                  objectFit: 'cover', 
                  borderRadius: '8px',
                  border: '2px solid rgba(141, 221, 166, 0.3)'
                }} 
              />
            ))}
          </div>
        )}
      </div>

      {/* PAGE 6: FLEX PAGE A */}
      <div className="pdf-page pdf-flex-page purple">
        <h1 className="pdf-section-header" style={{ color: 'white' }}>
          {data.flexA?.title || 'Unlocking Youth Potential'}
        </h1>
        
        {data.flexA?.subtitle && (
          <h2 className="pdf-section-subheader" style={{ color: '#8ddda6', fontSize: '20pt' }}>
            {data.flexA.subtitle}
          </h2>
        )}

        {data.flexA?.bodyText && (
          <div style={{ color: 'rgba(255, 255, 255, 0.95)', marginTop: '0.2in' }} dangerouslySetInnerHTML={{ __html: data.flexA.bodyText }} />
        )}

        {data.flexA?.stats && data.flexA.stats.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.3in', marginTop: '0.3in' }}>
            {data.flexA.stats.filter((s: any) => s.visible !== false).map((stat: any, index: number) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div className="pdf-highlight-stat" style={{ color: '#8ddda6' }}>{stat.number}</div>
                <p style={{ color: 'white', fontSize: '11pt' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {data.flexA?.carouselImages && data.flexA.carouselImages.length > 0 && (
          <div style={{ marginTop: '0.3in', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.15in' }}>
            {data.flexA.carouselImages.slice(0, 2).map((imageUrl: string, index: number) => (
              <img 
                key={index}
                src={imageUrl} 
                alt={`Flex A ${index + 1}`} 
                style={{ 
                  width: '100%', 
                  height: '2in', 
                  objectFit: 'cover', 
                  borderRadius: '12px',
                  border: '3px solid rgba(141, 221, 166, 0.3)'
                }} 
              />
            ))}
          </div>
        )}
      </div>

      {/* PAGE 7: FLEX PAGE B */}
      <div className="pdf-page pdf-flex-page blue">
        <h1 className="pdf-section-header" style={{ color: 'white' }}>
          {data.flexB?.title || 'Mentorship: The Missing Link'}
        </h1>
        
        {data.flexB?.subtitle && (
          <h2 className="pdf-section-subheader" style={{ color: '#8ddda6', fontSize: '20pt' }}>
            {data.flexB.subtitle}
          </h2>
        )}

        {data.flexB?.bodyText && (
          <div style={{ color: 'rgba(255, 255, 255, 0.95)', marginTop: '0.2in' }} dangerouslySetInnerHTML={{ __html: data.flexB.bodyText }} />
        )}

        {data.flexB?.stats && data.flexB.stats.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.3in', marginTop: '0.3in' }}>
            {data.flexB.stats.filter((s: any) => s.visible !== false).map((stat: any, index: number) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div className="pdf-highlight-stat" style={{ color: '#8ddda6' }}>{stat.number}</div>
                <p style={{ color: 'white', fontSize: '11pt' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {data.flexB?.carouselImages && data.flexB.carouselImages.length > 0 && (
          <div style={{ marginTop: '0.3in', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.15in' }}>
            {data.flexB.carouselImages.slice(0, 2).map((imageUrl: string, index: number) => (
              <img 
                key={index}
                src={imageUrl} 
                alt={`Flex B ${index + 1}`} 
                style={{ 
                  width: '100%', 
                  height: '2in', 
                  objectFit: 'cover', 
                  borderRadius: '12px',
                  border: '3px solid rgba(141, 221, 166, 0.3)'
                }} 
              />
            ))}
          </div>
        )}
      </div>

      {/* PAGE 8: FLEX PAGE C */}
      <div className="pdf-page pdf-flex-page green">
        <h1 className="pdf-section-header" style={{ color: '#111' }}>
          {data.flexC?.title || 'M-Power: Mental Health & Wellness'}
        </h1>
        
        {data.flexC?.subtitle && (
          <h2 className="pdf-section-subheader" style={{ color: '#111', fontSize: '20pt' }}>
            {data.flexC.subtitle}
          </h2>
        )}

        {data.flexC?.bodyText && (
          <div className="pdf-measurement-content" style={{ marginTop: '0.2in' }} dangerouslySetInnerHTML={{ __html: data.flexC.bodyText }} />
        )}

        {data.flexC?.stats && data.flexC.stats.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.3in', marginTop: '0.3in' }}>
            {data.flexC.stats.filter((s: any) => s.visible !== false).map((stat: any, index: number) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div className="pdf-highlight-stat" style={{ color: '#1946f5' }}>{stat.number}</div>
                <p style={{ color: '#111', fontSize: '11pt' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {data.flexC?.teamList && data.flexC.teamList.length > 0 && (
          <div style={{ marginTop: '0.3in' }}>
            <h3 className="pdf-section-subheader" style={{ color: '#111' }}>Team Members</h3>
            <p className="pdf-measurement-content" style={{ color: '#111' }}>
              {data.flexC.teamList.map((member: any) => member.name).join(' • ')}
            </p>
          </div>
        )}

        {data.flexC?.carouselImages && data.flexC.carouselImages.length > 0 && (
          <div style={{ marginTop: '0.3in', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.15in' }}>
            {data.flexC.carouselImages.slice(0, 2).map((imageUrl: string, index: number) => (
              <img 
                key={index}
                src={imageUrl} 
                alt={`Flex C ${index + 1}`} 
                style={{ 
                  width: '100%', 
                  height: '2in', 
                  objectFit: 'cover', 
                  borderRadius: '12px',
                  border: '3px solid rgba(25, 70, 245, 0.3)'
                }} 
              />
            ))}
          </div>
        )}
      </div>

      {/* PAGE 9: IMPACT LEVELS */}
      {data.impactLevels && (
        <div className="pdf-page pdf-impact-levels-page">
          <h1 className="pdf-section-header">{data.impactLevels?.sectionTitle || 'Impact Levels'}</h1>
          
          {data.impactLevels?.title && (
            <h2 className="pdf-section-subheader" style={{ marginBottom: '0.2in' }}>
              {data.impactLevels.title}
            </h2>
          )}
          
          {data.impactLevels?.description && (
            <div className="pdf-measurement-content pdf-mb-medium" dangerouslySetInnerHTML={{ __html: data.impactLevels.description }} />
          )}

          {data.impactLevels?.tiers && data.impactLevels.tiers.length > 0 && (
            <div style={{ marginTop: '0.3in', display: 'grid', gridTemplateColumns: '1fr', gap: '0.2in' }}>
              {data.impactLevels.tiers.map((tier: any, index: number) => (
                <div key={index} style={{
                  padding: '0.15in',
                  background: `linear-gradient(135deg, ${tier.color || '#1946f5'}22 0%, transparent 100%)`,
                  border: `2px solid ${tier.color || '#1946f5'}44`,
                  borderRadius: '8px'
                }}>
                  <h3 style={{ color: tier.color || '#1946f5', fontSize: '12pt', marginBottom: '0.05in' }}>
                    {tier.name}
                  </h3>
                  <p style={{ fontSize: '10pt', color: 'rgba(255,255,255,0.9)' }}>
                    {tier.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {data.impactLevels?.carouselImages && data.impactLevels.carouselImages.length > 0 && (
            <div style={{ marginTop: '0.4in', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.15in' }}>
              {data.impactLevels.carouselImages.slice(0, 3).map((imageUrl: string, index: number) => (
                <img 
                  key={index}
                  src={imageUrl} 
                  alt={`Impact Level ${index + 1}`} 
                  style={{ 
                    width: '100%', 
                    height: '1.5in', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    border: '2px solid rgba(141, 221, 166, 0.3)'
                  }} 
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TESTIMONIALS/SPOTLIGHTS - Dynamically generated from database */}
      {data.testimonials?.cards && data.testimonials.cards.filter((c: any) => c.visible !== false).slice(0, 2).map((testimonial: any, index: number) => (
        <div key={index} className="pdf-page pdf-spotlight-page">
          <h1 className="pdf-section-header">{testimonial.heading || 'Program Spotlight'}</h1>
          
          {testimonial.subheading && (
            <h2 className="pdf-section-subheader">{testimonial.subheading}</h2>
          )}
          
          {testimonial.image && (
            <div style={{ marginBottom: '0.3in' }}>
              <img 
                src={testimonial.image} 
                alt={testimonial.heading} 
                style={{ 
                  width: '100%', 
                  height: '2.5in', 
                  objectFit: 'cover', 
                  borderRadius: '12px',
                  border: '3px solid rgba(141, 221, 166, 0.3)'
                }} 
              />
            </div>
          )}

          {testimonial.body && (
            <div className="pdf-measurement-content" dangerouslySetInnerHTML={{ __html: testimonial.body }} />
          )}

          {testimonial.quote && (
            <div className="pdf-quote-box">
              <p className="pdf-quote-text">"{testimonial.quote}"</p>
              {testimonial.attribution && (
                <div className="pdf-quote-attribution">— {testimonial.attribution}</div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* PAGE 12: CURRICULUM - ARTISTIC DISCIPLINES */}
      <div className="pdf-page pdf-curriculum-page">
        <h1 className="pdf-section-header">{data.curriculum?.sectionTitle || 'Artistic Disciplines Taught'}</h1>
        
        {data.curriculum?.title && (
          <h2 className="pdf-section-subheader" style={{ marginBottom: '0.2in' }}>
            {data.curriculum.title}
          </h2>
        )}
        
        {data.curriculum?.subtitle && (
          <div className="pdf-measurement-content pdf-mb-medium" dangerouslySetInnerHTML={{ __html: data.curriculum.subtitle }} />
        )}

        {data.mission?.modals && data.mission.modals.find((m: any) => m.id === 'disciplines')?.items && (
          <div className="pdf-disciplines-grid">
            {data.mission.modals.find((m: any) => m.id === 'disciplines').items.map((discipline: any, index: number) => (
              <div key={index} className="pdf-discipline-item">{discipline.name}</div>
            ))}
          </div>
        )}

        {data.curriculum?.carouselImages && data.curriculum.carouselImages.length > 0 && (
          <div style={{ marginTop: '0.4in', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.15in' }}>
            {data.curriculum.carouselImages.slice(0, 6).map((imageUrl: string, index: number) => (
              <img 
                key={index}
                src={imageUrl} 
                alt={`Curriculum ${index + 1}`} 
                style={{ 
                  width: '100%', 
                  height: '1.5in', 
                  objectFit: 'cover', 
                  borderRadius: '8px',
                  border: '2px solid rgba(141, 221, 166, 0.3)'
                }} 
              />
            ))}
          </div>
        )}

        {data.curriculum?.ctaButtonText && (
          <div style={{ marginTop: '0.4in', textAlign: 'center' }}>
            <p className="pdf-measurement-content">
              <strong style={{ color: '#1946f5', fontSize: '12pt' }}>
                {data.curriculum.ctaButtonText}
              </strong>
            </p>
          </div>
        )}
      </div>

      {/* LOCATION PAGES - Dynamically generated with graphics instead of maps */}
      {data.nationalImpact?.regions && data.nationalImpact.regions.map((region: any, regionIndex: number) => (
        <div key={regionIndex} className="pdf-page pdf-locations-page">
          <h1 className="pdf-city-header">{region.name}</h1>
          
          {/* Decorative graphic instead of map */}
          <div style={{
            height: '2.5in',
            background: `
              radial-gradient(circle at 30% 40%, ${region.color || '#1946f5'}33 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, #8ddda633 0%, transparent 50%),
              linear-gradient(135deg, rgba(25, 70, 245, 0.1) 0%, rgba(141, 221, 166, 0.1) 100%)
            `,
            border: '3px solid rgba(141, 221, 166, 0.3)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.3in',
            marginBottom: '0.3in',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(141, 221, 166, 0.05) 20px, rgba(141, 221, 166, 0.05) 40px)'
            }} />
            <div style={{
              fontSize: '48pt',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1946f5, #8ddda6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              zIndex: 1
            }}>
              {region.locations?.length || 0}
            </div>
            <div style={{ fontSize: '14pt', color: 'white', fontWeight: 600, zIndex: 1, marginTop: '0.1in' }}>
              Program Sites
            </div>
          </div>

          <div className="pdf-sites-list" style={{ columnCount: 2, columnGap: '0.3in' }}>
            {region.locations && region.locations.length > 0 && (
              <ul style={{ margin: 0, padding: '0 0 0 0.2in' }}>
                {region.locations.map((location: any, locIndex: number) => (
                  <li key={locIndex} style={{ marginBottom: '0.08in', fontSize: '10pt', pageBreakInside: 'avoid' }}>
                    <strong>{location.name}</strong>
                    {location.showAddress && location.address && (
                      <div style={{ fontSize: '8pt', color: '#aaa', marginTop: '0.02in' }}>
                        {location.address}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}

      {/* PAGE: FINANCIAL ANALYSIS */}
      {data.financial && (
        <div className="pdf-page pdf-financial-page">
          <h1 className="pdf-section-header">{data.financial?.sectionTitle || 'Financial Overview'}</h1>
          
          {data.financial?.title && (
            <h2 className="pdf-section-subheader" style={{ marginBottom: '0.2in' }}>
              {data.financial.title}
            </h2>
          )}
          
          {data.financial?.description && (
            <div className="pdf-measurement-content pdf-mb-medium" dangerouslySetInnerHTML={{ __html: data.financial.description }} />
          )}

          {data.financial?.stats && data.financial.stats.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.3in', marginTop: '0.3in' }}>
              {data.financial.stats.map((stat: any, index: number) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div className="pdf-highlight-stat" style={{ fontSize: '42pt', color: '#1946f5' }}>
                    {stat.number}
                  </div>
                  <p style={{ fontSize: '12pt', fontWeight: 600 }}>{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {data.financial?.chartImages && data.financial.chartImages.length > 0 && (
            <div style={{ marginTop: '0.4in', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.2in' }}>
              {data.financial.chartImages.slice(0, 2).map((imageUrl: string, index: number) => (
                <img 
                  key={index}
                  src={imageUrl} 
                  alt={`Financial Chart ${index + 1}`} 
                  style={{ 
                    width: '100%', 
                    height: '2.5in', 
                    objectFit: 'contain', 
                    borderRadius: '8px'
                  }} 
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* PAGE: OUR SUPPORTERS */}
      {data.partners && (
        <div className="pdf-page pdf-supporters-page">
          <h1 className="pdf-section-header">{data.partners?.sectionTitle || 'Our Supporters'}</h1>
          
          {data.partners?.title && (
            <h2 className="pdf-section-subheader pdf-mb-medium">{data.partners.title}</h2>
          )}

          {data.partners?.subtitle && (
            <div className="pdf-measurement-content pdf-mb-medium" dangerouslySetInnerHTML={{ __html: data.partners.subtitle }} />
          )}

          {data.partners?.partnerLogos && data.partners.partnerLogos.length > 0 && (
            <div className="pdf-supporters-grid">
              {data.partners.partnerLogos.map((logoUrl: string, index: number) => (
                <div key={index} className="pdf-supporter-logo">
                  <img 
                    src={logoUrl} 
                    alt={`Partner ${index + 1}`} 
                    style={{ maxWidth: '100%', maxHeight: '60px', objectFit: 'contain' }} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PAGE: CONTACT */}
      <div className="pdf-page pdf-contact-page">
        <h1 className="pdf-section-header">{data.footer?.title || 'Contact'}</h1>
        
        {data.footer?.offices && data.footer.offices.length > 0 && (
          <div className="pdf-offices-grid">
            {data.footer.offices.map((office: any, index: number) => (
              <div key={index} className="pdf-office-box">
                <div className="pdf-office-city">{office.city?.toUpperCase()}</div>
                <div className="pdf-office-address" dangerouslySetInnerHTML={{ __html: office.address || 'Coming Soon' }} />
              </div>
            ))}
          </div>
        )}

        <div className="pdf-social-links">
          {data.footer?.website && (
            <p style={{ fontSize: '14pt', fontWeight: 600, marginBottom: '0.2in' }}>
              {data.footer.website}
            </p>
          )}
          {data.footer?.socialHandle && (
            <p style={{ fontSize: '14pt', fontWeight: 600, marginBottom: '0.2in' }}>
              {data.footer.socialHandle}
            </p>
          )}
          {data.footer?.socialText && (
            <p style={{ fontSize: '11pt', color: '#666' }}>
              {data.footer.socialText}
            </p>
          )}
        </div>

        <div style={{ 
          marginTop: '1in', 
          textAlign: 'center',
          padding: '0.3in',
          background: 'linear-gradient(90deg, #1946f5, #68369a, #8ddda6)',
          borderRadius: '8pt',
          color: 'white'
        }}>
          <p style={{ fontSize: '18pt', fontWeight: 700, margin: 0 }}>
            {data.mission?.missionStatement || 'Empowering Youth Through Music, Art & Mentorship'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImpactReportPDFTemplate;
