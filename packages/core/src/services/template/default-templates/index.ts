/**
 * 默认模板统一导入
 *
 * 🎯 极简设计：模板自身包含完整信息，无需额外配置
 *
 * @format
 */

// 导入所有模板
import { template as general_optimize } from "./optimize/general-optimize";
import { template as general_optimize_en } from "./optimize/general-optimize_en";
import { template as output_format_optimize } from "./optimize/output-format-optimize";
import { template as output_format_optimize_en } from "./optimize/output-format-optimize_en";
import { template as analytical_optimize } from "./optimize/analytical-optimize";
import { template as analytical_optimize_en } from "./optimize/analytical-optimize_en";
import { template as context_aware_optimize } from "./optimize/context-aware-optimize";

import { template as iterate } from "./iterate/iterate";
import { template as iterate_en } from "./iterate/iterate_en";

// Import specialized content iterate prompts
import { template as content_iterate_seo } from "./iterate/content-iterate-seo_en";
import { template as content_iterate_engagement } from "./iterate/content-iterate-engagement_en";
import { template as content_iterate_readability } from "./iterate/content-iterate-readability_en";
import { template as content_iterate_conversion } from "./iterate/content-iterate-conversion_en";
import { template as content_iterate_tone } from "./iterate/content-iterate-tone_en";
import { template as content_iterate_structure } from "./iterate/content-iterate-structure_en";
import { template as content_iterate_visual } from "./iterate/content-iterate-visual_en";
import { template as content_iterate_format } from "./iterate/content-iterate-format_en";
import { template as content_iterate_audience } from "./iterate/content-iterate-audience_en";
import { template as content_iterate_performance } from "./iterate/content-iterate-performance_en";

import { user_prompt_professional } from "./user-optimize/user-prompt-professional";
import { user_prompt_professional_en } from "./user-optimize/user-prompt-professional_en";
import { user_prompt_basic } from "./user-optimize/user-prompt-basic";
import { user_prompt_basic_en } from "./user-optimize/user-prompt-basic_en";
import { user_prompt_planning } from "./user-optimize/user-prompt-planning";
import { user_prompt_planning_en } from "./user-optimize/user-prompt-planning_en";

// Content Generation Templates
import { template as article_writer } from "./content-generation/article-writer_en";
import { template as story_writer } from "./content-generation/story-writer_en";
import { template as social_media_writer } from "./content-generation/social-media-writer_en";
import { template as tech_writer } from "./content-generation/tech-writer_en";
import { template as marketing_copy_writer } from "./content-generation/marketing-copy_en";
import { template as code_reviewer } from "./content-generation/code-reviewer_en";
import { template as business_strategy } from "./content-generation/business-strategy_en";
import { template as research_analyst } from "./content-generation/research-analyst_en";
import { template as educational_content } from "./content-generation/educational-content_en";
import { template as creative_problem_solver } from "./content-generation/creative-problem-solver_en";
import { template as product_documentation } from "./content-generation/product-documentation_en";
import { template as data_analyst } from "./content-generation/data-analyst_en";
import { template as ux_ui_designer } from "./content-generation/ux-ui-designer_en";
import { template as project_manager } from "./content-generation/project-manager_en";

// Import new master content creation prompts
import { template as master_content_user_prompts } from "./content-generation/master-content-user-prompts_en";
import { template as master_content_iterate } from "./iterate/master-content-iterate_en";

// 简单的模板集合 - 模板自身已包含完整信息（id、name、language、type等）
export const ALL_TEMPLATES = {
  general_optimize,
  general_optimize_en,
  output_format_optimize,
  output_format_optimize_en,
  analytical_optimize,
  analytical_optimize_en,
  context_aware_optimize,
  user_prompt_professional,
  user_prompt_professional_en,
  iterate,
  iterate_en,
  // Specialized content iterate prompts
  content_iterate_seo,
  content_iterate_engagement,
  content_iterate_readability,
  content_iterate_conversion,
  content_iterate_tone,
  content_iterate_structure,
  content_iterate_visual,
  content_iterate_format,
  content_iterate_audience,
  content_iterate_performance,
  user_prompt_basic,
  user_prompt_basic_en,
  user_prompt_planning,
  user_prompt_planning_en,
  // Content Generation Templates
  article_writer,
  story_writer,
  social_media_writer,
  tech_writer,
  marketing_copy_writer,
  code_reviewer,
  business_strategy,
  research_analyst,
  educational_content,
  creative_problem_solver,
  product_documentation,
  data_analyst,
  ux_ui_designer,
  project_manager,
  // Master content creation prompts
  master_content_user_prompts,
  master_content_iterate,
};
