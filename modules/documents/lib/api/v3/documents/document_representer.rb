#-- copyright
# OpenProject is an open source project management software.
# Copyright (C) 2012-2024 the OpenProject GmbH
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License version 3.
#
# OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
# Copyright (C) 2006-2013 Jean-Philippe Lang
# Copyright (C) 2010-2013 the ChiliProject Team
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
#
# See COPYRIGHT and LICENSE files for more details.
#++

module API
  module V3
    module Documents
      class DocumentRepresenter < ::API::Decorators::Single
        include API::Decorators::DateProperty
        include API::Decorators::FormattableProperty
        include API::Decorators::LinkedResource
        include API::Caching::CachedRepresenter
        include ::API::V3::Attachments::AttachableRepresenterMixin

        cached_representer key_parts: %i(project),
                           disabled: false

        self_link title_getter: ->(*) { represented.title }

        property :id

        property :title

        formattable_property :description

        date_time_property :created_at
        date_time_property :updated_at

        associated_resource :project,
                            link: ->(*) do
                              {
                                href: api_v3_paths.project(represented.project.id),
                                title: represented.project.name
                              }
                            end

        def _type
          'Document'
        end
      end
    end
  end
end
