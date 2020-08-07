using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<User> _userRepository;
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;


        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
        }

        public bool AddNewLanguage(AddLanguageViewModel language)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
        {
            //Your code here;
            User user = await _userRepository.GetByIdAsync(Id);
            TalentProfileViewModel talent = new TalentProfileViewModel
            {
                Id = user.Id,
                FirstName = user.FirstName,
                MiddleName = user.MiddleName,
                LastName = user.LastName,
                Gender = user.Gender,
                Email = user.Email,
                Phone = user.Phone,
                MobilePhone = user.MobilePhone,
                IsMobilePhoneVerified = user.IsMobilePhoneVerified,
                Address = user.Address,
                Nationality = user.Nationality,
                VisaStatus = user.VisaStatus,
                VisaExpiryDate = user.VisaExpiryDate,
                VideoName = user.VideoName,
                VideoUrl = "",
                CvName = user.CvName,
                CvUrl = "",
                Summary = user.Summary,
                Description = user.Description,
                LinkedAccounts = user.LinkedAccounts,
                JobSeekingStatus = user.JobSeekingStatus,
                ProfilePhotoUrl = user.ProfilePhotoUrl,
            //Education = user.Education,
            //Certifications = user.Certifications,
            //Experience = user.Experience,
        };

            talent.Languages = new List<AddLanguageViewModel>();
            user.Languages.ForEach(language =>
            {
                if (language.IsDeleted == false)
                {
                    talent.Languages.Add(new AddLanguageViewModel
                    {
                        Id = language.Id,
                        Name = language.Language,
                        Level = language.LanguageLevel,
                        CurrentUserId = user.Id,
                    });
                }
            });

            talent.Skills = new List<AddSkillViewModel>();
            user.Skills.ForEach(skill =>
            {
                if (skill.IsDeleted == false)
                {
                    talent.Skills.Add(new AddSkillViewModel
                    {
                        Id = skill.Id,
                        Name = skill.Skill,
                        Level = skill.ExperienceLevel,
                    });
                }
            });

            talent.Experience = new List<ExperienceViewModel>();
            user.Experience.ForEach(exp =>
            {
                if (exp.IsDeleted == false)
                {
                    talent.Experience.Add(new ExperienceViewModel
                    {
                        Id = exp.Id,
                        Company = exp.Company,
                        Position = exp.Position,
                        Responsibilities = exp.Responsibilities,
                        Start = exp.Start,
                        End = exp.End,
                    });
                }
            });

            return talent;
        }

        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel model, string updaterId)
        {
            User user = await _userRepository.GetByIdAsync(model.Id);
            user.FirstName = model.FirstName;
            user.MiddleName = model.MiddleName;
            user.LastName = model.LastName;
            user.Gender = model.Gender;
            user.Email = model.Email;
            user.Phone = model.Phone;
            user.MobilePhone = model.MobilePhone;
            user.IsMobilePhoneVerified = model.IsMobilePhoneVerified;
            user.Address = model.Address;
            user.Nationality = model.Nationality;
            user.VisaStatus = model.VisaStatus;
            user.VisaExpiryDate = model.VisaExpiryDate;
            user.VideoName = model.VideoName;
            user.ProfilePhotoUrl = model.ProfilePhotoUrl;
            //VideoUrl = "", //additional here
            user.CvName = model.CvName;
            //CvUrl = "",
            user.Summary = model.Summary;
            user.Description = model.Description;
            user.LinkedAccounts = model.LinkedAccounts;
            user.JobSeekingStatus = model.JobSeekingStatus;

            var newLanguages = new List<UserLanguage>();
            var newSkills = new List<UserSkill>();
            var newExperiences = new List<UserExperience>();

            model.Languages.ForEach(mLanguage => {
                UserLanguage language = null;
                if (mLanguage.Id == null)
                {
                    language = new UserLanguage
                    {
                        Id = ObjectId.GenerateNewId().ToString(),
                        IsDeleted = false
                    };
                }
                else
                {
                    language = user.Languages.SingleOrDefault(x => x.Id == mLanguage.Id);
                    if (language == null)
                    {
                        language = new UserLanguage
                        {
                            Id = ObjectId.GenerateNewId().ToString(),
                            IsDeleted = false
                        };
                    }
                }

                language.UserId = user.Id;
                language.Language = mLanguage.Name;
                language.LanguageLevel = mLanguage.Level;
                newLanguages.Add(language);
            });

            user.Languages.ForEach(uLanguage => {
                if (uLanguage.IsDeleted == false)
                {
                    bool deleted = true;
                    model.Languages.ForEach(mLanguage =>
                    {
                        if (mLanguage.Id != null && uLanguage.Id.Equals(mLanguage.Id))
                            deleted = false;
                    });
                    if (deleted == true)
                    {
                        uLanguage.IsDeleted = true;
                        newLanguages.Add(uLanguage);
                    }
                }
            });

            model.Skills.ForEach(mSkill => {
                UserSkill skill = null;
                if (mSkill.Id == null)
                {
                    skill = new UserSkill
                    {
                        Id = ObjectId.GenerateNewId().ToString(),
                        IsDeleted = false
                    };
                }
                else
                {
                    skill = user.Skills.SingleOrDefault(x => x.Id == mSkill.Id);
                    if (skill == null)
                    {
                        skill = new UserSkill
                        {
                            Id = ObjectId.GenerateNewId().ToString(),
                            IsDeleted = false
                        };
                    }
                }

                skill.UserId = user.Id;
                skill.Skill = mSkill.Name;
                skill.ExperienceLevel = mSkill.Level;
                newSkills.Add(skill);
            });

            user.Skills.ForEach(uSkill => {
                if (uSkill.IsDeleted == false)
                {
                    bool deleted = true;
                    model.Skills.ForEach(mSkill =>
                    {
                        if (mSkill.Id != null && uSkill.Id.Equals(mSkill.Id))
                            deleted = false;
                    });
                    if (deleted == true)
                    {
                        uSkill.IsDeleted = true;
                        newSkills.Add(uSkill);
                    }
                }
            });

            model.Experience.ForEach(mExp => {
                UserExperience exp = null;
                if (mExp.Id == null)
                {
                    exp = new UserExperience
                    {
                        Id = ObjectId.GenerateNewId().ToString(),
                        Company = mExp.Company,
                        Position = mExp.Position,
                        Responsibilities = mExp.Responsibilities,
                        Start = mExp.Start,
                        End = mExp.End,
                        IsDeleted = false,
                    };
                }
                else
                {
                    exp = user.Experience.SingleOrDefault(x => x.Id == mExp.Id);
                    if (exp == null)
                    {
                        exp = new UserExperience
                        {
                            Id = ObjectId.GenerateNewId().ToString(),
                            Company = mExp.Company,
                            Position = mExp.Position,
                            Responsibilities = mExp.Responsibilities,
                            Start = mExp.Start,
                            End = mExp.End,
                            IsDeleted = false,
                        };
                    }
                }

                newExperiences.Add(exp);
            });

            user.Experience.ForEach(uExp => {
                if (uExp.IsDeleted == false)
                {
                    bool deleted = true;
                    model.Experience.ForEach(mExp =>
                    {
                        if (mExp.Id != null && uExp.Id.Equals(mExp.Id))
                            deleted = false;
                    });
                    if (deleted == true)
                    {
                        uExp.IsDeleted = true;
                        newExperiences.Add(uExp);
                    }
                }
            });

            user.Languages = newLanguages;
            user.Skills = newSkills;
            user.Experience = newExperiences;

            //Languages = user.Languages, need for loop
            //Skills = user.Skills,
            //Education = user.Education,
            //Certifications = user.Certifications,
            //Experience = user.Experience,

            await _userRepository.Update(user);
            return true;
        }

        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentPhoto(IFormFile file, string talentId)
        {
            //Your code here;
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _userRepository.Update(profile);
                return true;
            }

            return false;
        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            List<User> users = _userRepository.GetQueryable().ToList();
            List < TalentSnapshotViewModel > result = new List<TalentSnapshotViewModel>();

            users.ForEach(user =>
            {
                TalentSnapshotViewModel snapshot = new TalentSnapshotViewModel
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    Name = $"{user.FirstName} {user.MiddleName} {user.LastName}",
                    PhotoId = user.ProfilePhotoUrl,
                    VideoUrl = user.VideoName,
                    CVUrl = user.CvName,
                    Summary = user.Summary,
                    CurrentEmployment = "",
                    Visa = user.VisaStatus,
                    Level = "",
                    Skills = new List<string>()
                };

                user.Skills.ForEach(skill =>
                {
                    snapshot.Skills.Add(skill.Skill);
                });

                result.Add(snapshot);
            });

            return result;
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }

        #endregion

        #region Build Views from Model

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill
            };
        }

        #endregion

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }
         
        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }
        #endregion

    }
}
