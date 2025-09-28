/**
 * 默认模板统一导入
 * 
 * 🎯 极简设计：模板自身包含完整信息，无需额外配置
 */

// 导入所有模板
import { template as general_optimize } from './optimize/general-optimize';
import { template as general_optimize_en } from './optimize/general-optimize_en';
import { template as output_format_optimize } from './optimize/output-format-optimize';
import { template as output_format_optimize_en } from './optimize/output-format-optimize_en';
import { template as analytical_optimize } from './optimize/analytical-optimize';
import { template as analytical_optimize_en } from './optimize/analytical-optimize_en';
import { template as context_aware_optimize } from './optimize/context-aware-optimize';

import { template as iterate } from './iterate/iterate';
import { template as iterate_en } from './iterate/iterate_en';
import { template as add_detail_iterate_en } from './iterate/add-detail-iterate_en';
import { template as simplify_prompt_iterate_en } from './iterate/simplify-prompt-iterate_en';
import { template as change_tone_iterate_en } from './iterate/change-tone-iterate_en';
import { template as add_constraints_iterate_en } from './iterate/add-constraints-iterate_en';
import { template as change_format_iterate_en } from './iterate/change-format-iterate_en';
import { template as refine_persona_iterate_en } from './iterate/refine-persona-iterate_en';
import { template as add_examples_iterate_en } from './iterate/add-examples-iterate_en';
import { template as clarify_language_iterate_en } from './iterate/clarify-language-iterate_en';
import { template as expand_scope_iterate_en } from './iterate/expand-scope-iterate_en';
import { template as focus_on_creativity_iterate_en } from './iterate/focus-on-creativity-iterate_en';
import { template as refine_workflow_iterate_en } from './iterate/refine-workflow-iterate_en';

import { user_prompt_professional } from './user-optimize/user-prompt-professional';
import { user_prompt_professional_en } from './user-optimize/user-prompt-professional_en';
import { user_prompt_basic } from './user-optimize/user-prompt-basic';
import { user_prompt_basic_en } from './user-optimize/user-prompt-basic_en';
import { user_prompt_planning } from './user-optimize/user-prompt-planning';
import { user_prompt_planning_en } from './user-optimize/user-prompt-planning_en';

import { template as ad_copy_en } from './content-creation/ad-copy_en';
import { template as blog_post_en } from './content-creation/blog-post_en';
import { template as case_study_en } from './content-creation/case-study_en';
import { template as email_newsletter_en } from './content-creation/email-newsletter_en';
import { template as landing_page_copy_en } from './content-creation/landing-page-copy_en';
import { template as press_release_en } from './content-creation/press-release_en';
import { template as product_description_en } from './content-creation/product-description_en';
import { template as social_media_post_en } from './content-creation/social-media-post_en';
import { template as website_copy_en } from './content-creation/website-copy_en';
import { template as white_paper_en } from './content-creation/white-paper_en';

import { template as documentary_script_en } from './video-creation/documentary-script_en';
import { template as educational_video_script_en } from './video-creation/educational-video-script_en';
import { template as explainer_video_script_en } from './video-creation/explainer-video-script_en';
import { template as livestream_plan_en } from './video-creation/livestream-plan_en';
import { template as testimonial_video_script_en } from './video-creation/testimonial-video-script_en';
import { template as tiktok_script_en } from './video-creation/tiktok-script_en';
import { template as training_video_script_en } from './video-creation/training-video-script_en';
import { template as video_ad_script_en } from './video-creation/video-ad-script_en';
import { template as webinar_script_en } from './video-creation/webinar-script_en';
import { template as youtube_script_en } from './video-creation/youtube-script_en';

import { template as quick_tip_short_en } from './youtube-shorts/quick-tip-short_en';
import { template as diy_hack_short_en } from './youtube-shorts/diy-hack-short_en';
import { template as before_after_short_en } from './youtube-shorts/before-after-short_en';
import { template as storytime_short_en } from './youtube-shorts/storytime-short_en';
import { template as product_review_short_en } from './youtube-shorts/product-review-short_en';
import { template as educational_fact_short_en } from './youtube-shorts/educational-fact-short_en';
import { template as challenge_short_en } from './youtube-shorts/challenge-short_en';
import { template as motivational_short_en } from './youtube-shorts/motivational-short_en';
import { template as comedy_sketch_short_en } from './youtube-shorts/comedy-sketch-short_en';
import { template as unboxing_short_en } from './youtube-shorts/unboxing-short_en';

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
  add_detail_iterate_en,
  simplify_prompt_iterate_en,
  change_tone_iterate_en,
  add_constraints_iterate_en,
  change_format_iterate_en,
  refine_persona_iterate_en,
  add_examples_iterate_en,
  clarify_language_iterate_en,
  expand_scope_iterate_en,
  focus_on_creativity_iterate_en,
  refine_workflow_iterate_en,
  user_prompt_basic,
  user_prompt_basic_en,
  user_prompt_planning,
  user_prompt_planning_en,
  ad_copy_en,
  blog_post_en,
  case_study_en,
  email_newsletter_en,
  landing_page_copy_en,
  press_release_en,
  product_description_en,
  social_media_post_en,
  website_copy_en,
  white_paper_en,
  documentary_script_en,
  educational_video_script_en,
  explainer_video_script_en,
  livestream_plan_en,
  testimonial_video_script_en,
  tiktok_script_en,
  training_video_script_en,
  video_ad_script_en,
  webinar_script_en,
  youtube_script_en,
  quick_tip_short_en,
  diy_hack_short_en,
  before_after_short_en,
  storytime_short_en,
  product_review_short_en,
  educational_fact_short_en,
  challenge_short_en,
  motivational_short_en,
  comedy_sketch_short_en,
  unboxing_short_en,
};
